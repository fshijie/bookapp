<!--<template>
    <div class="launch-approve ut-bg-form ut-min-h-full">
        <GeFormRenderer
            ref="refForm"
            :items="dataFormRender.items"
            :readonly="dataFormRender.readonly"
            v-model="dataFormRender.value"
            :result.sync="dataFormRender.result"
            :origin-value="dataFormRender.originValue"
        />
        <div class="ut-p-4 ut-bg-white ut-mt-4" v-loading="dataIsFetchingFlow">
            <div class="ut-text-sm ut-pb-4">{{ dataFlowTitle }}</div>
            <TimelineFlow :items="dataTimelineFlow.items" @change="val => (dataTimelineFlow.value = val)" :editable="dataTimelineFlow.editable" />
        </div>
        <div class="ut-p-4 ut-bg-white ut-mt-4">
            <div class="ut-text-sm ut-pb-4">附件</div>
            <ExUploader :readonly="dataFilesReadonly" v-model="dataFiles" />
        </div>
    </div>
</template>-->

<script>
import LaunchApprove from './LaunchApprove';
import GeFormRenderer from '@/components/form-provider/GeFormRenderer';
import TimelineFlow from '@/components/main/common/TimelineFlow';
import ExUploader from '@/components/extends/ExUploader';

export default {
    name: 'AuditApproveTempSave',
    mixins: [LaunchApprove],
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
        }
    },
    components: {
        GeFormRenderer,
        TimelineFlow,
        ExUploader
    },
    data() {
        return {
            dataCheckPointSuperviseId: '',
            dataFilesReadonly: false,
            dataOldFiles: '[]',
        };
    },
    watch: {},
    computed: {
        computedCheckPointParams() {
            return {
                superviseId: this.dataCheckPointSuperviseId,
            };
        },
    },
    methods: {
        // 获取提交数据
        handleGetTempSaveData(saveType) {
            return {
                oldFiles: this.dataOldFiles,
                jsonStr: JSON.stringify({
                    ...this.dataFormRender.result,
                    附件: JSON.stringify(this.dataFiles),
                    __check_point_data__: this.computedShowCheckPoint && !this.dataCheckPointReadonly ? this.$refs.refCheckPoint.emitGetData() : undefined
                }),
                baseData: JSON.stringify({
                    // 暂存不传taskId
                    taskId: saveType === 'temp' ? undefined : this.modelData.taskId,
                    userId: this.$store.getters.userId,
                    id: this.modelData.formId,
                    tableName: this.modelData.tableName,
                }),
                status: 0,

            };
        },
        async handleFetching(retry = 0) {
            this.dataIsFetchingData = true;
            try {
                const formReq = this.$axios.get('server/spFormType/formList', { params: { pid: this.modelData.pid } });
                const dataReq = this.$axios.get('server/spFormType/echoDisplay', { params: { pid: this.modelData.pid } });
                const formItems = await formReq;
                const formData = await dataReq;

                this.dataFormRender.items = formItems;
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
                                this.handleFetchingFLow();
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

                if (this.computedShowCheckPoint && !this.dataCheckPointReadonly) {
                    await this.$refs.refCheckPoint.emitValidate();
                }

                await this.$axios.post('server/spFormType/SubmitApproval', this.handleGetTempSaveData('submit'));
                this.handleSuccess('提交');
            } catch (error) {
                if (!isInner) {
                    this.dataIsSubmiting = false;
                    throw error;
                }
            }
            this.dataIsSubmiting = false;
        },
        async emitTempSave(isInner = false) {
            this.dataIsTempSaveSubmiting = true;
            try {
                await this.handleValidateP();

                if (this.computedShowCheckPoint && !this.dataCheckPointReadonly) {
                    await this.$refs.refCheckPoint.emitValidate();
                }

                await this.$axios.post('server/spFormType/tempSave', this.handleGetTempSaveData('temp'));
                this.handleSuccess('暂存');
            } catch (error) {
                if (!isInner) {
                    this.dataIsTempSaveSubmiting = false;
                    throw error;
                }
            }
            this.dataIsTempSaveSubmiting = false;
        }
    },
    created() {}
};
</script>

<style lang="less" scoped></style>
