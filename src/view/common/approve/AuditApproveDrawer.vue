<template>
    <ex-drawer
        :visible.sync="computedVisible"
        :title="title"
        :close-on-press-escape="false"
        :wrapper-closable="false"
        :size="size"
        destroy-on-close
        :loading="dataIsFetching || dataIsTempSaveSubmiting || dataIsSubmiting"
    >
        <template #default="{ closeDrawer }">
            <div tabindex="0"></div>
            <AuditApproveTempSave
                v-if="computedVisible && modelData.status === 0"
                ref="refAuditApprove"
                class="ut--m-4 ut-p-4"
                :sync-fetching.sync="dataIsFetching"
                :sync-temp-save-submiting.sync="dataIsTempSaveSubmiting"
                :sync-submiting.sync="dataIsSubmiting"
                :sync-fetching-flow.sync="dataIsFetchingFlow"
                :sync-result.sync="computedSyncResult"
                :sync-flow-items.sync="computedSyncFlowItems"
                @success="computedVisible = false"
                :model-data="modelData"
            />
            <AuditApproveCompleted
                v-else-if="computedVisible && modelData.status === 2"
                ref="refAuditApprove"
                class="ut--m-4 ut-p-4"
                :sync-fetching.sync="dataIsFetching"
                :sync-result.sync="computedSyncResult"
                :sync-flow-items.sync="computedSyncFlowItems"
                @success="computedVisible = false"
                :model-data="modelData"
            />
            <AuditApproveReject
                v-else-if="computedVisible && modelData.status === 3"
                ref="refAuditApprove"
                class="ut--m-4 ut-p-4"
                :sync-fetching.sync="dataIsFetching"
                :sync-temp-save-submiting.sync="dataIsTempSaveSubmiting"
                :sync-submiting.sync="dataIsSubmiting"
                :sync-fetching-flow.sync="dataIsFetchingFlow"
                :sync-result.sync="computedSyncResult"
                :sync-flow-items.sync="computedSyncFlowItems"
                @success="computedVisible = false"
                :model-data="modelData"
            />
            <AuditApproveProcessing
                v-else-if="computedVisible && modelData.status === 1"
                ref="refAuditApprove"
                class="ut--m-4 ut-p-4"
                :sync-fetching.sync="dataIsFetching"
                :sync-submiting.sync="dataIsSubmiting"
                :sync-fetching-flow.sync="dataIsFetchingFlow"
                :sync-result.sync="computedSyncResult"
                :sync-processing-show-merge.sync="computedSyncProcessingShowMerge"
                :sync-flow-items.sync="computedSyncFlowItems"
                @success="computedVisible = false"
                @reject-success="$emit('success')"
                :model-data="modelData"
            />
        </template>
        <template #footer="{ closeDrawer }">
            <div class="ut-text-center">
                <el-button type="info" plain @click="closeDrawer" :disabled="dataIsTempSaveSubmiting || dataIsSubmiting">
                    取消
                </el-button>
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
                <slot name="extend-button" :close-drawer="closeDrawer" :is-submiting="dataIsSubmiting" :is-temp-save-submitting="dataIsTempSaveSubmiting"></slot>
            </div>
        </template>
    </ex-drawer>
</template>

<script>
import AuditApproveTempSave from '@/components/main/common/approve/AuditApproveTempSave';
import AuditApproveCompleted from '@/components/main/common/approve/AuditApproveCompleted';
import AuditApproveReject from '@/components/main/common/approve/AuditApproveReject';
import AuditApproveProcessing from '@/components/main/common/approve/AuditApproveProcessing';

// 状态 0: 暂存 1: 审批中 2: 已完成 3: 驳回，4: 作废
export default {
    name: 'AuditApproveDrawer',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '流程审批'
        },
        modelData: {
            type: Object,
            default: () => ({
                status: 0
            })
        },
        syncResult: {
            type: Object,
            default: () => ({})
        },
        syncProcessingShowMerge: {
            type: Boolean,
            default: false
        },
        syncFlowItems: {
            type: Array,
            default: () => []
        },
        size: {
            type: String,
            default: '80%'
        }
    },
    components: {
        AuditApproveTempSave,
        AuditApproveCompleted,
        AuditApproveReject,
        AuditApproveProcessing
    },
    data() {
        return {
            dataVisible: this.visible,

            dataIsFetching: false,
            dataIsSubmiting: false,
            dataIsTempSaveSubmiting: false,
            dataIsFetchingFlow: false,
            dataIsFetchingHistory: false
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
        }
    },
    computed: {
        computedVisible: {
            get() {
                return this.dataVisible;
            },
            set(val) {
                this.$emit('update:visible', val);
            }
        },
        computedSyncResult: {
            get() {
                return this.syncResult;
            },
            set(val) {
                this.$emit('update:syncResult', val);
            }
        },
        computedSyncProcessingShowMerge: {
            get() {
                this.syncProcessingShowMerge;
            },
            set(val) {
                this.$emit('update:syncProcessingShowMerge', val);
            }
        },
        computedSyncFlowItems: {
            get() {
                this.syncFlowItems;
            },
            set(val) {
                this.$emit('update:syncFlowItems', val);
            }
        }
    },
    methods: {
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
                } catch (error) {}
            }
        },
        async handleSubmit() {
            if (this.$refs && this.$refs.refAuditApprove && this.$refs.refAuditApprove.emitSubmit) {
                try {
                    await this.$refs.refAuditApprove.emitSubmit();
                    this.$emit('success');
                } catch (error) {}
            }
        },
        emitRefresh() {
            this.$refs.refAuditApprove.emitRefresh();
        }
    }
};
</script>

<style lang="less" scoped></style>
