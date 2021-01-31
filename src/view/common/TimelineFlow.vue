<template>
    <div>
        <el-timeline :class="computedOnlyOne ? 'timeline--onlyone' : ''">
            <template v-if="editable">
                <el-timeline-item v-for="(item, index) in items" :key="'timeline_' + index" type="primary" :hide-timestamp="true">
                    <el-card>
                        <div class="ut-flex ut--my-1">
                            <div>
                                <h4 class="ut-font-bold">{{ item.name }}</h4>
                                <div class="ut-flex ut-flex-wrap ut--m-1 ut-pt-2 ut-items-center">
                                    <div
                                        class="ut-p-1"
                                        v-for="(subItem, subIndex) in handleGetEditUsers(item.id)"
                                        :key="'data_value_item_' + item.id + '_' + subIndex"
                                    >
                                        <div class="ut-px-2 ut-py-1 ut-bg-primary ut-text-white ut-rounded-sm ut-leading-4 ut-text-xs">
                                            {{ handleGetNameByUserId(item.id, subItem) }}
                                        </div>
                                    </div>
                                    <div v-if="item.multiple" class="ut-ml-1 ut-text-primary ut-text-base">
                                        <div
                                            class="ut-border ut-border-dashed ut-rounded-full ut-flex ut-justify-center ut-items-center ut-border-primary ut-cursor-pointer"
                                            style="width: 1.4rem; height: 1.4rem;"
                                            @click="handlePickStart(item.id)"
                                        >
                                            <i class="el-icon-plus" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </el-timeline-item>
            </template>
            <template v-else>
                <el-timeline-item
                    v-for="(item, index) in items"
                    :key="'timeline_readonly_' + index"
                    type="primary"
                    :timestamp="item.endTime"
                    :hide-timestamp="false"
                    placement="top"
                >
                    <el-card>
                        <div class="ut-flex ut--my-1 ut-items-center ut-flex-wrap sm:ut-flex-no-wrap">
                            <div class="ut-flex-shrink-0">
                                <h4 class="ut-font-bold ut-mr-4">{{ item.activityName }}</h4>
                                <div class="ut-flex ut-flex-wrap ut--m-1 ut-pt-2">
                                    <div class="ut-p-1">
                                        <div class="ut-px-2 ut-py-1 ut-bg-primary ut-text-white ut-rounded-sm ut-leading-4 ut-text-xs">
                                            {{ item.approver }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="ut-ml-auto ut-text-sm ut-text-gray-600 ut-flex ut-items-center ut-pt-1 ut-w-full sm:ut-w-auto ut-break-all"
                                style="min-height: 48px;"
                            >
                                <template v-if="handleIsImg(item.comment)">
                                    <div class="ut-whitespace-no-wrap ut-text-sm ut-text-info ut-mr-2">审批意见</div>
                                    <img
                                        @click="handlePreviewImage(item.comment)"
                                        :src="item.comment"
                                        class="ut-border ut-border-dashed ut-cursor-pointer"
                                    />
                                </template>
                                <div v-else>{{ item.comment }}</div>
                            </div>
                        </div>
                        <div v-if="showFile">
                            <ExUploader class="files" :readonly="true" :file-list="handleGetFiles(item)" multiple />
                        </div>
                    </el-card>
                </el-timeline-item>
            </template>
        </el-timeline>
        <!-- 候选框 -->
        <el-dialog
            title="数据选项"
            :visible.sync="dataDialogVisible"
            width="520px"
            class="ui-flex-dialog"
            append-to-body
            :close-on-click-modal="false"
            :close-on-press-escape="false"
        >
            <el-checkbox-group v-model="dataValueTemp" class="ut-w-full">
                <el-checkbox
                    v-for="(item, index) in computedOptions"
                    style="display: block; width: 100%; margin: 0; padding: 4px 0; white-space: normal;"
                    :label="item.userId"
                    :key="'radio_item_' + index"
                    >{{ item.userName }}</el-checkbox
                >
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <div class="ut-flex">
                    <el-checkbox :indeterminate="computedIsIndeterminate" v-model="computedIsCheckAll">全选</el-checkbox>
                    <div class="ut-ml-auto">
                        <el-button size="small" @click="dataDialogVisible = false">取 消</el-button>
                        <el-button size="small" type="primary" @click="handlePickerOk">确 定</el-button>
                    </div>
                </div>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import ExUploader from '@/components/extends/ExUploader';

export default {
    name: 'TimelineFlow',
    props: {
        items: {
            type: Array,
            defalut: () => [],
        },
        editable: {
            type: Boolean,
            default: false,
        },
        showFile: {
            type: Boolean,
            default: false,
        },
        files: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        ExUploader,
    },
    data() {
        return {
            dataModel: {
                value: [],
            },
            dataDialogVisible: false,
            dataValueTemp: [],
            dataPickerActivityId: '',
        };
    },
    watch: {
        items: {
            immediate: true,
            handler(value) {
                this.dataModel.value = (value || []).map(val => ({
                    activityId: val.id,
                    userIds: (val.userList || []).map(user => user.userId).join(','),
                }));
                this.$emit('change', this.dataModel.value);
            },
        },
        'dataModel.value'(value) {
            this.$emit('change', value);
        },
    },
    computed: {
        computedOnlyOne() {
            return this.items.length === 1;
        },
        computedIsCheckAll: {
            get() {
                return this.computedOptions.length === this.dataValueTemp.length && this.computedOptions.length > 0;
            },
            set(value) {
                if (value) {
                    this.dataValueTemp = this.computedOptions.map(val => val.userId);
                } else {
                    this.dataValueTemp = [];
                }
            },
        },
        computedIsIndeterminate() {
            let isIndeterminate = true;
            if (this.computedOptions.length === 0 || this.dataValueTemp.length === 0) {
                isIndeterminate = false;
            } else if (this.computedIsCheckAll) {
                isIndeterminate = false;
            }
            return isIndeterminate;
        },
        computedOptions() {
            const item = (this.items || []).find(val => val.id === this.dataPickerActivityId) || {};

            return item.userList || [];
        },
    },
    methods: {
        handleGetFiles(item) {
            const activityId = item.activityId;
            return (this.files || []).filter(file => file.segmentId === activityId);
        },
        handlePreviewImage(url) {
            this.$root.$emit('ex:image-preview', [{ name: '审批意见', url }], 0);
        },
        handleIsImg(str = '') {
            return str.indexOf('data:image/png;base64,') === 0 && str.length > 200;
        },
        handlePickerOk() {
            this.dataModel.value = this.dataModel.value.map(val => {
                if (val.activityId === this.dataPickerActivityId) {
                    return {
                        ...val,
                        userIds: this.dataValueTemp.join(','),
                    };
                }

                return val;
            });
            this.dataDialogVisible = false;
        },
        handlePickStart(activityId) {
            this.dataPickerActivityId = activityId;
            this.dataValueTemp = [...this.handleGetEditUsers(activityId)];
            this.dataDialogVisible = true;
        },
        handleGetEditUsers(activityId) {
            const item = this.dataModel.value.find(val => val.activityId === activityId);

            if (item && item.userIds) {
                return item.userIds.split(',');
            }

            return [];
        },
        handleGetNameByUserId(activityId, userId) {
            const item = (this.items || []).find(val => val.id === activityId);

            if (!item) {
                return '';
            }

            const userList = item.userList || [];
            const userItem = userList.find(val => val.userId === userId);

            return userItem ? userItem.userName : '';
        },
    },
};
</script>

<style lang="less" scoped>
.timeline--onlyone {
    /deep/ .el-timeline-item__node {
        display: none;
    }
    /deep/ .el-timeline-item__wrapper {
        padding-left: 0;
    }
}
.files {
    /deep/ .ex-file-list__no-files {
        padding: 10px 0;
        text-align: left;
    }
}
</style>
