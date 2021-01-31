<template>
    <el-input
        :value="computedName"
        @click.native="handleSelect"
        :placeholder="placeholder"
        auto-complete="off"
        :prefix-icon="stateUser.loading ? 'el-icon-loading' : ''"
        :disabled="stateUser.loading"
        :clearable="clearable"
        @clear="handleClear"
    ></el-input>
</template>

<script>
export default {
    name: 'UserSelectInput',
    props: {
        value: {
            type: String,
            default: '',
        },
        placeholder: {
            type: String,
            default: '',
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        clearable: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            stateUser: this.$ex.request({
                action: () => Promise.all(this.value.split(',').map(id => this.$axios.get('admin/tbUser/getCommonUserById', { params: { id } }))),
                extra: {},
                initData: [],
                skip: !this.value,
            }),
            isClear: false,
        };
    },
    computed: {
        computedIds() {
            if (this.multiple) {
                return this.value ? this.value.split(',') : [];
            }
            return this.value ? [this.value] : [];
        },
        computedItems() {
            return this.computedIds.map(id => {
                const item = this.stateUser.data.find(item => (item.id || item.userId) === id) || {};
                return {
                    name: item.name || item.userName,
                    id,
                    allName: item.allName || item.allUserName || item.userName,
                };
            });
        },
        computedName() {
            return this.computedItems.map(item => item.allName || item.name).join(' , ');
        },
    },
    methods: {
        handleSelect() {
            if (this.isClear) {
                this.isClear = false;
                return;
            }
            this.isClear = false;
            this.$root.$emit('ex:show-picker', {
                type: 'user',
                multiple: this.multiple,
                value: this.computedItems,
                success: (value = []) => {
                    this.stateUser.data.push(...value);
                    const ids = value.map(item => item.id).join(',');
                    this.$emit('input', ids);
                },
            });
        },
        handleClear() {
            this.isClear = true;
            this.$emit('input', '');
        },
    },
};
</script>

<style lang="less" scoped></style>
