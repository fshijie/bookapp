<template>
    <el-input
        :value="computedName"
        @click.native="handleSelectOrg"
        :placeholder="placeholder"
        auto-complete="off"
        :prefix-icon="stateTree.loading ? 'el-icon-loading' : ''"
        :disabled="stateTree.loading"
        :clearable="clearable"
        @clear="handleClear"
    >
    </el-input>
</template>

<script>
export default {
    name: 'OrgSelectInput',
    props: {
        value: {
            type: String,
            default: '',
        },
        flatenTree: {
            type: Object,
            default: null,
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
            stateTree: this.$ex.request({
                action: () => this.$axios.get('admin/vOrg/getTree'),
                extra: {},
                initData: [],
                skip: !!this.flatenTree,
            }),
            isClear: false,
        };
    },
    computed: {
        computedItem() {
            return this.computedTreeObj[this.value] || {};
        },
        computedName() {
            return this.computedItem.allName || this.computedItem.name;
        },
        computedTreeObj() {
            if (this.flatenTree) {
                return this.flatenTree;
            }

            return this.computedTreeFlaten;
        },
        computedTreeFlaten() {
            const treeFlaten = {};
            if (this.stateTree.data) {
                this.handleGetTreeOrg(this.stateTree.data, treeFlaten);
            }

            return treeFlaten;
        },
    },
    methods: {
        handleGetTreeOrg(trees = [], flaten = {}) {
            trees.forEach(tree => {
                flaten[tree.id] = tree;

                this.handleGetTreeOrg(tree.children, flaten);
            });
        },
        handleSelectOrg() {
            if (this.isClear) {
                this.isClear = false;
                return;
            }
            this.isClear = false;

            if (this.stateTree.loading) {
                return;
            }

            const value = [];

            if (this.value) {
                value.push({
                    name: this.computedItem.name,
                    id: this.value,
                    allName: this.computedItem.allName,
                });
            }

            this.$root.$emit('ex:show-picker', {
                type: 'org',
                multiple: false,
                value,
                success: value => this.$emit('input', (value[0] || {}).id),
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
