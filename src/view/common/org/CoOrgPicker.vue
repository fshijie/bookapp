<template>
    <el-dialog
        class="ui-flex-dialog ui-flex-dialog--body_full"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :title="computedTitle"
        :visible.sync="computedVisible"
        width="1000px"
    >
        <OrgIndex is-picker :picker-options="pickerOptions" v-model="value" />
        <span slot="footer" class="dialog-footer">
            <div class="ut-flex">
                <div class="ut-ml-auto">
                    <el-button size="small" @click="computedVisible = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="handlePickerOk">确 定</el-button>
                </div>
            </div>
        </span>
    </el-dialog>
</template>

<script>
import OrgIndex from '@/components/main/common/OrgIndex.vue';

export default {
    name: 'CoOrgPicker',
    components: {
        OrgIndex,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        pickerOptions: {
            type: Object,
            default: () => ({
                type: 'org',
                multiple: true,
                value: [],
                topLevel: '-1',
                orgType: '',
                success: () => null,
                error: () => null,
            }),
        },
    },
    data() {
        const pickerOptions = {
            type: 'org',
            multiple: true,
            value: [],
            success: () => null,
            error: () => null,
            topLevel: '-1',
            orgType: '',
            ...this.pickerOptions,
        };
        return {
            value: this._.cloneDeep(pickerOptions.value),
        };
    },
    computed: {
        computedTitle() {
            if (this.pickerOptions.type === 'org') {
                return '组织机构选择';
            } else if (this.pickerOptions.type === 'user') {
                return '人员选择';
            }
        },
        computedVisible: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit('update:visible', val);
            },
        },
    },
    methods: {
        handlePickerOk() {
            if (this.pickerOptions && this.pickerOptions.success) {
                this.pickerOptions.success(this._.cloneDeep(this.value));
            }
            this.computedVisible = false;
        },
    },
};
</script>

<style lang="less" scoped></style>
