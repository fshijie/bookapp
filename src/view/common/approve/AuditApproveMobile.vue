<template>
    <div class="ut-min-h-screen ut-flex ut-flex-col ut-h-screen" v-loading="dataIsFetching">
        <div class="ut-flex-1 ut-overflow-auto">
            <AuditApproveTempSave
                v-if="computedVisible && modelData.status === 0"
                ref="refAuditApprove"
                class="ut-p-4"
                :sync-fetching.sync="dataIsFetching"
                :sync-temp-save-submiting.sync="dataIsTempSaveSubmiting"
                :sync-submiting.sync="dataIsSubmiting"
                :sync-fetching-flow.sync="dataIsFetchingFlow"
                :sync-result.sync="computedSyncResult"
                :sync-flow-items.sync="dataSyncFlowItems"
                @success="computedVisible = false"
                :model-data="modelData"
            />
            <AuditApproveCompleted
                v-else-if="computedVisible && modelData.status === 2"
                ref="refAuditApprove"
                class="ut-p-4"
                :sync-fetching.sync="dataIsFetching"
                :sync-result.sync="computedSyncResult"
                :sync-flow-items.sync="dataSyncFlowItems"
                @success="computedVisible = false"
                :model-data="modelData"
            />
            <AuditApproveReject
                v-else-if="computedVisible && modelData.status === 3"
                ref="refAuditApprove"
                class="ut-p-4"
                :sync-fetching.sync="dataIsFetching"
                :sync-temp-save-submiting.sync="dataIsTempSaveSubmiting"
                :sync-submiting.sync="dataIsSubmiting"
                :sync-fetching-flow.sync="dataIsFetchingFlow"
                :sync-result.sync="computedSyncResult"
                :sync-flow-items.sync="dataSyncFlowItems"
                @success="computedVisible = false"
                :model-data="modelData"
            />
            <AuditApproveProcessing
                v-else-if="computedVisible && modelData.status === 1"
                ref="refAuditApprove"
                class="ut-p-4"
                :sync-fetching.sync="dataIsFetching"
                :sync-submiting.sync="dataIsSubmiting"
                :sync-fetching-flow.sync="dataIsFetchingFlow"
                :sync-result.sync="computedSyncResult"
                :sync-processing-show-merge.sync="computedSyncProcessingShowMerge"
                :sync-flow-items.sync="dataSyncFlowItems"
                @success="computedVisible = false"
                @reject-success="
                    $emit('success');
                    handleNotifyApp({ type: 'audit-close' });
                "
                :model-data="modelData"
            />
            <LaunchApprove
                v-else-if="computedVisible && modelData.status === -1"
                ref="refAuditApprove"
                class="ut-p-4"
                :sync-fetching.sync="dataIsFetching"
                :sync-temp-save-submiting.sync="dataIsTempSaveSubmiting"
                :sync-submiting.sync="dataIsSubmiting"
                :sync-fetching-flow.sync="dataIsFetchingFlow"
                :sync-result.sync="computedSyncResult"
                @success="computedVisible = false"
                :model-data="modelData"
                interval-cache
                :origin-value="modelData.__originValue__"
            />
        </div>
        <div v-if="modelData.status !== 2" class="ut-text-center ut-py-4 ut-flex-shrink-0 ut-border-t">
            <!-- <el-button type="info" plain @click="closeDrawer" :disabled="dataIsTempSaveSubmiting || dataIsSubmiting">
                取消
            </el-button> -->
            <!-- <el-button type="info" plain @click="handleNotifyApp({ type: 'audit-close' })">
                Notify
            </el-button> -->
            <template v-if="modelData.status === 0">
                <el-button
                    type="primary"
                    plain
                    :disabled="dataIsFetching || dataIsSubmiting || dataIsFetchingFlow"
                    :loading="dataIsTempSaveSubmiting"
                    @click="handleTempSave"
                >
                    暂存
                </el-button>
                <el-button
                    type="primary"
                    :disabled="dataIsFetching || dataIsTempSaveSubmiting || dataIsFetchingFlow"
                    :loading="dataIsSubmiting"
                    @click="handleSubmit"
                >
                    提交
                </el-button>
            </template>
            <template v-else-if="modelData.status === 3">
                <el-button
                    type="primary"
                    plain
                    :disabled="dataIsFetching || dataIsSubmiting"
                    :loading="dataIsTempSaveSubmiting"
                    @click="handleTempSave"
                >
                    暂存
                </el-button>
                <el-button type="primary" :disabled="dataIsFetching || dataIsTempSaveSubmiting" :loading="dataIsSubmiting" @click="handleSubmit">
                    提交
                </el-button>
            </template>
            <template v-else-if="modelData.status === 1">
                <el-button type="danger" :disabled="dataIsFetching || dataIsSubmiting" @click="handleRejection">
                    驳回
                </el-button>
                <el-button type="primary" :disabled="dataIsFetching || dataIsTempSaveSubmiting" :loading="dataIsSubmiting" @click="handleSubmit">
                    同意
                </el-button>
            </template>
            <template v-else-if="modelData.status === -1">
                <el-button
                    type="primary"
                    plain
                    :disabled="dataIsFetching || dataIsSubmiting || dataIsFetchingFlow"
                    :loading="dataIsTempSaveSubmiting"
                    @click="handleTempSave"
                >
                    暂存
                </el-button>
                <el-button
                    type="primary"
                    :disabled="dataIsFetching || dataIsTempSaveSubmiting || dataIsFetchingFlow"
                    :loading="dataIsSubmiting"
                    @click="handleSubmit"
                >
                    提交
                </el-button>
            </template>
            <template v-if="syncMergeCount > 1 && handleShowMerge()">
                <el-button
                    class="ui-animate--zoomInDown"
                    @click="
                        mergeVisible = true;
                    "
                    type="danger"
                    plain
                >
                    作业平衡({{ syncMergeCount }})
                </el-button>
            </template>
        </div>

        <JobPlanMerge
            :visible.sync="mergeVisible"
            :syncMergeCount.sync="syncMergeCount"
            :planId="modelData.formId"
            :activityName="handleGetLastActivityName(dataSyncFlowItems)"
        />
    </div>
</template>

<script>
import AuditApproveTempSave from '@/components/main/common/approve/AuditApproveTempSave';
import AuditApproveCompleted from '@/components/main/common/approve/AuditApproveCompleted';
import AuditApproveReject from '@/components/main/common/approve/AuditApproveReject';
import AuditApproveProcessing from '@/components/main/common/approve/AuditApproveProcessing';
import LaunchApprove from '@/components/main/common/approve/LaunchApprove';
import JobPlanMerge from '@/components/main/common/job-plan-merge/JobPlanMerge';

// 状态 0: 暂存 1: 审批中 2: 已完成 3: 驳回，4: 作废
export default {
    name: 'AuditApproveMobile',
    props: {
        // visible: {
        //     type: Boolean,
        //     default: false,
        // },
        // title: {
        //     type: String,
        //     default: '流程审批',
        // },
        // modelData: {
        //     type: Object,
        //     default: () => ({
        //         status: 0,
        //     }),
        // },
        syncResult: {
            type: Object,
            default: () => ({}),
        },
        syncProcessingShowMerge: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        AuditApproveTempSave,
        AuditApproveCompleted,
        AuditApproveReject,
        AuditApproveProcessing,
        JobPlanMerge,
        LaunchApprove,
    },
    data() {
        return {
            mergeVisible: false,
            dataSyncFlowItems: [],
            syncMergeCount: 0,
            dataVisible: true,

            dataIsFetching: false,
            dataIsSubmiting: false,
            dataIsTempSaveSubmiting: false,
            dataIsFetchingFlow: false,
            dataIsFetchingHistory: false,
        };
    },
    watch: {
        visible(value) {
            if (value) {
                this.dataIsFetching = false;
                this.dataIsSubmiting = false;
                this.dataIsTempSaveSubmiting = false;
                this.dataIsFetchingFlow = false;
                this.dataIsFetchingHistory = false;
            }

            this.dataVisible = value;
        },
    },
    computed: {
        modelData() {
            // 0: 暂存 1: 审批中 2: 已完成 3: 驳回，4: 作废
            const { type } = this.computedRouterMeta;

            if (type === 'completed') {
                // 已办
                return {
                    pid: this.computedRouterParams.pid,
                    status: 2,
                    modelId: this.computedRouterParams.modelId,
                    formId: this.computedRouterParams.formId,
                };
            } else if (type === 'approve') {
                try {
                    const data = JSON.parse(decodeURIComponent(this.computedRouterParams.data));
                    return data;
                } catch (err) {
                    this.$alert('数据解析出错', '提示', {
                        type: 'danger',
                    })
                        .then(() => {
                            // this.$router.replace('/');
                        })
                        .catch(() => {
                            // this.$router.replace('/');
                        });
                    return {};
                }
            } else if (type === 'launch') {
                try {
                    const data = JSON.parse(decodeURIComponent(this.computedRouterParams.data)) || {};
                    const originValue = JSON.parse(decodeURIComponent(this.computedRouterParams.originValue)) || {};
                    return {
                        ...data,
                        status: -1,
                        __originValue__: originValue,
                    };
                } catch (err) {
                    this.$alert('数据解析出错', '提示', {
                        type: 'danger',
                    })
                        .then(() => {
                            // this.$router.replace('/');
                        })
                        .catch(() => {
                            // this.$router.replace('/');
                        });
                    return {};
                }
            }
        },
        computedRouterMeta() {
            return this.$route.meta;
        },
        computedRouterParams() {
            return this.$route.params;
        },
        computedVisible: {
            get() {
                return this.dataVisible;
            },
            set(val) {
                this.$emit('update:visible', val);
            },
        },
        computedSyncResult: {
            get() {
                return this.syncResult;
            },
            set(val) {
                this.$emit('update:syncResult', val);
            },
        },
        computedSyncProcessingShowMerge: {
            get() {
                this.syncProcessingShowMerge;
            },
            set(val) {
                this.$emit('update:syncProcessingShowMerge', val);
            },
        },
    },
    methods: {
        handleShowMerge() {
            if ([1].includes(this.modelData.status)) {
                return true;
            }

            return false;
        },
        handleGetLastActivityName(items = []) {
            const last = this._.last(items);
            if (last) {
                return last.activityName || last.name;
            }

            return '';
        },
        handleNotifyApp(action = { type: '', data: '' }) {
            if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
                window.flutter_inappwebview.callHandler('Notify', action);
            // }
            // if (Notify && Notify.postMessage) {
            //     Notify.postMessage(JSON.stringify(action));
            } else {
                this.$alert('Notify不存在', '提示', {
                    type: 'danger',
                })
                    .then(() => {
                        // this.$router.replace('/');
                    })
                    .catch(() => {
                        // this.$router.replace('/');
                    });
            }
        },
        handleRejection() {
            if (this.$refs && this.$refs.refAuditApprove && this.$refs.refAuditApprove.emitShowRejectionModal) {
                this.$refs.refAuditApprove.emitShowRejectionModal();
            }
        },
        async handleTempSave() {
            if (this.$refs && this.$refs.refAuditApprove && this.$refs.refAuditApprove.emitTempSave) {
                try {
                    await this.$refs.refAuditApprove.emitTempSave();
                    this.$emit('success');
                    this.handleNotifyApp({ type: 'audit-close' });
                } catch (error) {}
            }
        },
        async handleSubmit() {
            if (this.$refs && this.$refs.refAuditApprove && this.$refs.refAuditApprove.emitSubmit) {
                try {
                    await this.$refs.refAuditApprove.emitSubmit();
                    this.$emit('success');
                    this.handleNotifyApp({ type: 'audit-close' });
                } catch (error) {}
            }
        },
        emitRefresh() {
            this.$refs.refAuditApprove.emitRefresh();
        },
    },
};
</script>

<style lang="less" scoped></style>
