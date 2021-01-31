<template>
    <ex-drawer
        :visible.sync="computedVisible"
        :title="title"
        :close-on-press-escape="false"
        :wrapper-closable="false"
        size="80%"
        destroy-on-close
        :loading="dataIsFetching || dataIsTempSaveSubmiting || dataIsSubmiting"
    >
        <template #default="{ closeDrawer }">
            <LaunchApprove
                v-if="computedVisible"
                ref="refLaunchApprove"
                class="ut--m-4 ut-p-4"
                :sync-fetching.sync="dataIsFetching"
                :sync-temp-save-submiting.sync="dataIsTempSaveSubmiting"
                :sync-submiting.sync="dataIsSubmiting"
                :sync-fetching-flow.sync="dataIsFetchingFlow"
                :sync-result.sync="computedSyncResult"
                @success="computedVisible = false"
                :model-data="modelData"
                interval-cache
                :origin-value="originValue"
            />
        </template>
        <template #footer="{ closeDrawer }">
            <div class="ut-text-center">
                <el-button type="info" plain @click="closeDrawer" :disabled="dataIsTempSaveSubmiting || dataIsSubmiting">
                    取消
                </el-button>
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
                <slot name="extend-button" :close-drawer="closeDrawer" :is-submiting="dataIsSubmiting" :is-temp-save-submitting="dataIsTempSaveSubmiting"></slot>
            </div>
        </template>
    </ex-drawer>
</template>

<script>
import LaunchApprove from '@/components/main/common/approve/LaunchApprove';

export default {
    name: 'LaunchApproveDrawer',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '发起审批'
        },
        modelData: {
            type: Object,
            default: () => ({})
        },
        syncResult: {
            type: Object,
            default: () => ({})
        },
        // 初始值
        originValue: {
            type: Object,
            default: null
        }
    },
    components: {
        LaunchApprove
    },
    data() {
        return {
            dataVisible: this.visible,

            dataIsFetching: false,
            dataIsSubmiting: false,
            dataIsTempSaveSubmiting: false,
            dataIsFetchingFlow: false
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
        }
    },
    methods: {
        async handleTempSave() {
            if (this.$refs && this.$refs.refLaunchApprove && this.$refs.refLaunchApprove.emitTempSave) {
                try {
                    await this.$refs.refLaunchApprove.emitTempSave();
                    this.$emit('success');
                } catch (error) {}
            }
        },
        async handleSubmit() {
            if (this.$refs && this.$refs.refLaunchApprove && this.$refs.refLaunchApprove.emitSubmit) {
                try {
                    await this.$refs.refLaunchApprove.emitSubmit();
                    this.$emit('success');
                } catch (error) {}
            }
        },
        emitRefresh() {
            this.$refs.refLaunchApprove.emitRefresh();
        }
    }
};
</script>

<style lang="less" scoped></style>
