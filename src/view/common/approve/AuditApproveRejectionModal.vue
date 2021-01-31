<template>
    <el-dialog
        title="请选择驳回节点"
        :visible.sync="computedVisible"
        width="520px"
        custom-class="ui-flex-modal"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <el-radio-group v-model="dataValue" class="ut-w-full" v-loading="isFetching || submitting">
            <el-radio
                v-for="(item, index) in computedOptions"
                style="display: block; width: 100%; margin: 0; padding: 4px 0; white-space: normal;"
                :label="item.activityId"
                :key="'radio_item_' + index"
            >
                {{ item.activityName + '(' + item.approver + ')' }}
            </el-radio>
        </el-radio-group>
        <div v-if="computedOptions.length === 0 && !(isFetching || submitting)" class="ut-text-center">已无可驳回节点</div>
        <span slot="footer" class="dialog-footer">
            <div class="ut-flex">
                <div class="ut-ml-auto">
                    <el-button size="small" @click="computedVisible = false" :disabled="submitting">取 消</el-button>
                    <el-button size="small" type="primary" @click="handlePickerOk" :disabled="computedOptions.length === 0" :loading="submitting">确 定</el-button>
                </div>
            </div>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'AuditApproveRejectionModal',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        instanceId: {
            type: String,
            default: ''
        },
        submitRejectionFn: {
            type: Function,
            default: () => null
        },
        currentActivityId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isFetching: false,
            dataValue: '',
            dataOptions: [],
            submitting: false
        };
    },
    watch: {
        visible(value) {
            // 每次打开就清除选中值
            if (value) {
                this.dataValue = '';
            }
        }
    },
    computed: {
        computedVisible: {
            get() {
                return this.visible;
            },
            set(value) {
                this.$emit('update:visible', value);
            }
        },
        computedOptions() {
            return (this.dataOptions || []).filter(opt => opt.activityId !== this.currentActivityId);
        }
    },
    methods: {
        async handlePickerOk() {
            if (!this.dataValue) {
                return this.$message({
                    message: '请选择驳回节点',
                    type: 'warning',
                    showClose: true
                });
            }

            this.submitting = true;

            try {
                await this.submitRejectionFn(this.dataValue);
            } catch (error) {}

            this.submitting = false;
        },
        async fetchingList(retry = 0) {
            this.isFetching = true;
            try {
                const data = await this.$axios.get('server/spFormType/findHisActivitiList', { params: { instanceId: this.instanceId } });
                this.dataOptions = data;
            } catch (error) {
                if (retry < 3) {
                    return this.fetchingList(++retry);
                }
            }
            this.isFetching = false;
        },
        init() {
            this.fetchingList();
        }
    },
    created() {
        this.init();
    }
};
</script>

<style lang="less" scoped></style>
