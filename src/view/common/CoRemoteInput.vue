<template>
    <div class="ut-inline-block">
        <el-input
            :value="computedName"
            @click.native="handleSelect"
            :placeholder="fieldProps.placeholder"
            auto-complete="off"
            :clearable="clearable"
            @clear="handleClear"
        >
        </el-input>
        <GeFormExtendsRemoteDialog
            :fieldProps="fieldProps"
            :controlProps="controlProps"
            :visible.sync="dataDialogVisible"
            :value="dataValueTemp"
            :dataOptions.sync="dataOptions"
            @success="handlePickerOk"
        />
    </div>
</template>

<script>
/**
 * 通用远程选择框组件
 * version: 0.1
 * changlog:
 *     init
 */

import GeFormExtendsRemoteDialog from '@/components/form-provider/form-extends/GeFormExtendsRemoteDialog.vue';

export default {
    name: 'CoRemoteInput',
    components: {
        GeFormExtendsRemoteDialog,
    },
    props: {
        value: {
            type: String,
            default: '',
        },
        clearable: {
            type: Boolean,
            default: false,
        },
        fieldProps: {
            type: Object,
            default: () => ({
                title: '远程选择',
                placeholder: '请选择',
                addTitle: '',
                titlePosition: 'left',
                required: true,
                listUrl: '',
                listQueryParams: '[{"key": "name", "label": "名称"}]',
                detailUrl: '',
                listItemFormat: '<%= name %>',
                showFormat: '<%= name %>',
                showStyle: '',
                detailComponent: '',
                multiple: false,
                layout: 'inline',
                initValue: '',
            }),
        },
    },
    data() {
        return {
            dataDialogVisible: false,
            dataValueTemp: '',
            controlProps: {
                visible: true,
                readonly: false,
            },
            dataOptions: [],
            stateOne: this.$ex.request({
                action: vars => {
                    const requests = vars.ids.map(id => {
                        const config = { params: { id } };

                        if (/^http/.test(this.fieldProps.detailUrl)) {
                            config.baseURL = '';
                        }

                        return this.$axios.get(this.fieldProps.detailUrl, config);
                    });
                    return Promise.all(requests);
                },
                variables: { ids: [] },
                initData: [],
                onSuccess: state => {
                    this.dataOptions.push(...(state.data || []));
                },
                extra: {},
                skip: true,
            }),
            isClear: false,
            dataModel: {
                value: this.value == null ? this.fieldProps.default : this.value,
            },
        };
    },
    watch: {
        value(value) {
            this.dataModel.value = value;
        },
    },
    computed: {
        computedName() {
            return this.computedValues.map(val => this.handleGetShowName(val)).join(', ');
        },
        computedValues() {
            const requestIds = [];
            const values = this.computedIds.map((id, index) => {
                const item = this.dataOptions.find(val => val.id === id);

                if (!item) {
                    requestIds.push(id);
                }

                return item || {};
            });

            if (requestIds.length > 0 && this.stateOne.times <= 3) {
                this.stateOne.send({ ids: requestIds });
            }

            return values;
        },
        computedIds() {
            if (this.fieldProps.multiple) {
                return this.dataModel.value ? this.dataModel.value.split(',') : [];
            }

            return this.dataModel.value ? [this.dataModel.value] : [];
        },
    },
    methods: {
        handlePickerOk(value) {
            this.dataModel.value = value;
            this.dataDialogVisible = false;
            this.$emit('input', this.dataModel.value);
        },
        handleSelect() {
            if (this.isClear) {
                this.isClear = false;
                return;
            }
            this.isClear = false;

            this.dataValueTemp = this.dataModel.value;
            this.dataDialogVisible = true;
        },
        handleGetShowName(item = {}) {
            return this._.template(this.fieldProps.showFormat)(item);
        },
        handleClear() {
            this.isClear = true;
            this.$emit('input', '');
        },
    },
};
</script>

<style lang="less" scoped></style>
