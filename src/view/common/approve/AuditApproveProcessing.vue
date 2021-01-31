<template>
    <div class="launch-approve ut-bg-form ut-min-h-full">
        <GeFormRenderer
            ref="refForm"
            :items="dataFormRender.items"
            :readonly="dataFormRender.readonly"
            v-model="dataFormRender.value"
            :result.sync="dataFormRender.result"
            :origin-value="dataFormRender.originValue"
            :editable-items="dataFormRender.editableItems"
        />
        <div v-if="computedShowCheckPoint" class="ut-p-4 ut-bg-white ut-mt-4">
            <CheckPoint ref="refCheckPoint" :readonly="dataCheckPointReadonly" :queryParams="computedCheckPointParams" />
        </div>
        <div class="ut-p-4 ut-bg-white ut-mt-4" v-loading="dataIsFetchingFlow">
            <div class="ut-text-sm ut-pb-4">{{ dataFlowTitle }}</div>
            <TimelineFlow :items="dataTimelineFlow.items" @change="val => (dataTimelineFlow.value = val)" :editable="dataTimelineFlow.editable" />
        </div>
        <div class="ut-p-4 ut-bg-white ut-mt-4">
            <!-- <div class="ut-mx-auto ut-max-w-full" style="width: 360px">
                <HandleWrite ref="refHandleWrite" title="审批意见" />
            </div> -->
            <div class="ut-text-sm ut-pb-4">审批意见</div>
            <el-form ref="refFormExtra" :model="dataFormExtra" :rules="dataFormExtraRule">
                <el-form-item prop="comment">
                    <el-input type="textarea" :rows="4" v-model="dataFormExtra.comment"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="ut-p-4 ut-bg-white ut-mt-4">
            <div class="ut-text-sm ut-pb-4">附件</div>
            <ExUploader :readonly="dataFilesReadonly" :file-list="dataFiles" multiple />
        </div>
        <AuditApproveRejectionModal
            :visible.sync="dataRejectionModalVisible"
            :instanceId="modelData.pid"
            :submitRejectionFn="handleRejectionSubmit"
            :currentActivityId="dataSegement.id"
        />
    </div>
</template>

<script>
import AuditApproveTempSave from './AuditApproveTempSave';
import GeFormRenderer from '@/components/form-provider/GeFormRenderer';
import TimelineFlow from '@/components/main/common/TimelineFlow';
import ExUploader from '@/components/extends/ExUploader';
// import HandleWrite from '@/components/main/common/HandleWrite';
import AuditApproveRejectionModal from './AuditApproveRejectionModal';

export default {
    name: 'AuditApproveProcessing',
    mixins: [AuditApproveTempSave],
    props: {
        modelData: {
            type: Object,
            default: () => ({
                formId: '',
                flowModelId: '',
                pid: '',
                tableName: '',
                taskId: ''
            })
        },
        syncProcessingShowMerge: {
            type: Boolean,
            default: false
        }
    },
    components: {
        GeFormRenderer,
        TimelineFlow,
        ExUploader,
        // HandleWrite,
        AuditApproveRejectionModal
    },
    data() {
        return {
            dataCheckPointReadonly: true,
            dataFilesReadonly: false,
            dataRejectionModalVisible: false,
            dataFlowTitle: '审批记录',
            dataOldFiles: '[]',
            dataIsFetchingHistory: false,
            dataFormRender: {
                items: [],
                readonly: true,
                value: [],
                originValue: null,
                result: {},
                editableItems: []
            },
            dataTimelineFlow: {
                items: [],
                value: [],
                editable: false
            },
            dataSegement: {},
            dataFormExtra: {
                comment: ''
            },
            dataFormExtraRule: { comment: [{ required: true, message: '请输入审批意见', trigger: 'blur' }] }
        };
    },
    watch: {},
    methods: {
        handleRejectSuccess() {
            this.$emit('reject-success');
            this.$message({
                message: '驳回成功',
                type: 'success',
                showClose: true
            });
        },
        handleGetSubmitData() {
            // const handleWriteData = this.$refs.refHandleWrite.emitGetDataURL();

            return {
                oldFiles: this.dataOldFiles,
                jsonStr: JSON.stringify({
                    ...this.dataFormRender.result,
                    附件: JSON.stringify(this.dataFiles),
                    // comment: handleWriteData
                    comment: this.dataFormExtra.comment
                }),
                baseData: JSON.stringify({
                    taskId: this.modelData.taskId,
                    userId: this.$store.getters.userId,
                    id: this.modelData.formId,
                    tableName: this.modelData.tableName
                }),
                status: 1
            };
        },
        // 驳回提交
        async handleRejectionSubmit(rejectionId) {
            // const handleWriteData = this.$refs.refHandleWrite.emitGetDataURL();

            const reqData = {
                oldFiles: this.dataOldFiles,
                jsonStr: JSON.stringify({
                    ...this.dataFormRender.result,
                    附件: JSON.stringify(this.dataFiles),
                    // rejectopinion: handleWriteData
                    rejectopinion: this.dataFormExtra.comment
                }),
                assignee: this.$store.getters.userId,
                taskId: this.modelData.taskId,
                activityId: rejectionId,
                baseData: JSON.stringify({
                    taskId: this.modelData.taskId,
                    userId: this.$store.getters.userId,
                    id: this.modelData.formId,
                    tableName: this.modelData.tableName
                })
            };

            await this.$axios.post('server/spFormType/rejectTaskToOneStep', reqData);

            this.dataRejectionModalVisible = false;
            this.handleSuccess('驳回');
            this.handleRejectSuccess();
        },
        // 获取审批历史意见
        async handleFetchingHistory(retry = 0) {
            this.dataIsFetchingFlow = true;
            try {
                const req = this.$axios.get('server/spFormType/findHisActivitiList', { params: { instanceId: this.modelData.pid } });
                const historyData = await req;
                this.dataTimelineFlow.items = historyData;
            } catch (error) {
                if (retry < 3) {
                    return this.handleFetchingHistory(++retry);
                }
            }
            this.dataIsFetchingFlow = false;
        },
        async handleFetching(retry = 0) {
            this.dataIsFetchingData = true;
            try {
                const formReq = this.$axios.get('server/spFormType/formList', { params: { pid: this.modelData.pid } });
                const dataReq = this.$axios.get('server/spFormType/echoDisplay', { params: { pid: this.modelData.pid } });
                const segementReq = this.$axios.post('server/SpWorkflow/getCurrentActivityByTaskId', {
                    taskId: this.modelData.taskId
                });
                const formItems = await formReq;
                const formData = await dataReq;
                const segementData = await segementReq;

                const editableItems = await this.$axios.post('server/spActFieldEditable/getByActId/' + segementData.id);

                if (((editableItems || {}).fields || []).length > 0) {
                    this.$emit('update:syncProcessingShowMerge', true);
                }

                this.dataSegement = segementData;
                this.dataFormRender.items = formItems;
                // temp
                // this.dataFormRender.editableItems = (editableItems || {}).fields || [];
                this.dataFormRender.originValue = (formData || {}).data || {};
                this.dataOldFiles = ((formData || {}).data || {})['附件'];
                this.dataFiles = JSON.parse(this.dataOldFiles || '[]');

                if (this.computedShowCheckPoint) {
                    this.dataCheckPointSuperviseId = ((formData || {}).data || {})['安全监督计划'];
                }

                await new Promise(res => {
                    // 需要等下一个事件循环再放入异步中以保证获取到数据
                    this.$nextTick(() =>
                        setTimeout(() => {
                            // 由于自定义表单渲染器设置初始值修改value是宏队列异步任务，因此为了在之后执行该操作，在相同宏队列中再放入一个宏队列中执行
                            setTimeout(() => {
                                this.handleFetchingHistory();
                                res();
                            }, 0);
                        }, 0)
                    );
                });
            } catch (error) {
                if (retry < 3) {
                    return this.handleFetching(++retry);
                }
            }
            this.dataIsFetchingData = false;
        },
        async emitSubmit(isInner = false) {
            this.dataIsSubmiting = true;
            try {
                await this.handleValidateP();
                // if (!this.$refs.refHandleWrite.emitHasContent()) {
                //     this.$message({
                //         message: '请书写审批意见',
                //         type: 'warning',
                //         showClose: true
                //     });
                //     throw new Error('请书写审批意见');
                // }

                try {
                    await this.$refs.refFormExtra.validate();
                } catch (error) {
                    this.$message({
                        message: '请填写审批意见',
                        type: 'warning',
                        showClose: true
                    });
                    throw new Error('请填写审批意见');
                }
                await this.$axios.post('server/spFormType/SubmitApproval', this.handleGetSubmitData());
                this.handleSuccess('提交');
            } catch (error) {
                if (!isInner) {
                    this.dataIsSubmiting = false;
                    throw error;
                }
            }
            this.dataIsSubmiting = false;
        },
        async emitShowRejectionModal() {
            try {
                await this.handleValidateP();
            } catch (error) {
                return;
            }

            // if (!this.$refs.refHandleWrite.emitHasContent()) {
            //     return this.$message({
            //         message: '请书写审批意见',
            //         type: 'warning',
            //         showClose: true
            //     });
            // }

            try {
                await this.$refs.refFormExtra.validate();
            } catch (error) {
                return this.$message({
                    message: '请填写审批意见',
                    type: 'warning',
                    showClose: true
                });
            }

            this.dataRejectionModalVisible = true;
        }
    },
    created() {
        this.$emit('update:syncProcessingShowMerge', false);
    }
};
</script>

<style lang="less" scoped></style>
