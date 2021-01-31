<template>
    <el-dialog
        title="作业平衡"
        :visible.sync="computedVisible"
        width="1200px"
        class="ui-flex-dialog"
        append-to-body
        :close-on-click-modal="!editable"
        :close-on-press-escape="!editable"
        destroy-on-close
    >
        <div v-if="$store.state.isMobile" v-loading="stateQuery.loading || stateMutation.loading">
            <div v-for="(item, index) in stateQuery.data" :key="'item_' + index" class="ut-rounded ut-shadow ut-p-4 ut-mb-4">
                <div class="ut-flex">
                    <div class="ut-font-bold ut-flex-shrink-0 ut-pr-3">上报部门</div>
                    <div class="ut-flex-1">{{ handleGetDepartmentName(item.上报部门) }}</div>
                </div>
                <div class="ut-flex">
                    <div class="ut-font-bold ut-flex-shrink-0 ut-pr-3">作业内容</div>
                    <div class="ut-flex-1">{{ item.作业内容 }}</div>
                </div>
                <div class="ut-flex">
                    <div class="ut-font-bold ut-flex-shrink-0 ut-pr-3">停电设备</div>
                    <div class="ut-flex-1">{{ item.停电设备 }}</div>
                </div>
                <div class="ut-flex">
                    <div class="ut-font-bold ut-flex-shrink-0 ut-pr-3">计划开始停电时间</div>
                    <div class="ut-flex-1">{{ item.计划开始停电时间 ? $dayjs(item.计划开始停电时间).format('YYYY-MM-DD HH:mm:ss') : '' }}</div>
                </div>
                <div class="ut-flex">
                    <div class="ut-font-bold ut-flex-shrink-0 ut-pr-3">停电时户数</div>
                    <div class="ut-flex-1">{{ item.停电时户数 }}</div>
                </div>
            </div>
        </div>
        <el-table v-else :data="stateQuery.data" style="width: 100%" v-loading="stateQuery.loading || stateMutation.loading">
            <el-table-column header-align="center" align="center" prop="上报部门" label="上报部门">
                <template #default="scope">
                    {{ handleGetDepartmentName(scope.row.上报部门) }}
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" prop="作业内容" label="作业内容" width="200">
                <template #default="scope">
                    {{ scope.row.作业内容 }}
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" prop="停电设备" label="停电设备" width="200">
                <template #default="scope">
                    {{ scope.row.停电设备 }}
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" prop="计划开始停电时间" label="计划开始停电时间" width="210">
                <template #default="scope">
                    <el-date-picker v-if="editable" style="width: 100%;" v-model="scope.row.计划开始停电时间" type="datetime"> </el-date-picker>
                    <span v-else>{{ scope.row.计划开始停电时间 ? $dayjs(scope.row.计划开始停电时间).format('YYYY-MM-DD HH:mm:ss') : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" prop="停电时户数" label="停电时户数" width="200">
                <template #default="scope">
                    {{ scope.row.停电时户数 }}
                </template>
            </el-table-column>
        </el-table>
        <!-- <span v-if="editable" slot="footer">
            <div class="ut-flex">
                <div class="ut-ml-auto">
                    <el-button size="small" @click="computedVisible = false" :disabled="stateMutation.loading">取 消</el-button>
                    <el-button
                        size="small"
                        @click="stateMutation.send({ data: stateQuery.data })"
                        type="primary"
                        :disabled="stateQuery.loading"
                        :loading="stateMutation.loading"
                    >
                        确 定
                    </el-button>
                </div>
            </div>
        </span> -->
    </el-dialog>
</template>

<script>
export default {
    name: 'JobPlanMerge',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        // editable: {
        //     type: Boolean,
        //     default: false,
        // },
        requestLocation: {
            type: String,
            default: '',
        },
        // 异步获取有重复数据则同步更新外部变量
        syncMergeCount: {
            type: Number,
            default: 0,
        },
        planId: {
            type: String,
            default: '',
        },
        activityName: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            /**
             * args: {
             *    action: Function<Promise>,
             *    variables: object,
             *    update: Function,
             *    initData: any,
             *    skip: Boolean,
             *    onSuccess: Function,
             *    onError: Function,
             *    onComplete: Function,
             * }
             * result: {
             *    loading: Boolean,
             *    data: any,
             *    fullData: any,
             *    error: any,
             *    variables: object,
             *    send: Function,
             *    init: Function,
             * }
             */
            editable: false,
            stateQuery: this.$ex.request({
                action: vars =>
                    this.$axios.get('server/SpModel/findRepeatableJobPlan', { params: { planId: this.planId } }),
                initData: [],
                variables: {},
                skip: true,
            }),
            stateMutation: this.$ex.request({
                action: ({ data }) =>
                    this.$axios.post(
                        'server/SpModel/modifyJobPlan',
                        (data || []).map(item => ({ ...item, 厂站名称: item.厂站名称.id }))
                    ),
                variables: {},
                initData: [],
                skip: true,
                onSuccess: () => {
                    this.computedVisible = false;
                    this.$emit('success');
                },
            }),
        };
    },
    watch: {
        visible(value) {
            if (value) {
                // this.stateQuery.init();
                // this.stateQuery.send({ tableMap: { 厂站名称: this.requestLocation } });

                this.stateMutation.init();
            }
        },
        // requestLocation(value) {
        //     this.stateQuery.init();

        //     if (value) {
        //         this.stateQuery.send({tableMap: {厂站名称: this.requestLocation}});
        //     }
        // },
        'stateQuery.data'(value) {
            this.$emit('update:syncMergeCount', value.length);
        },
        computedFetchParams(value) {
            if (this.planId && this.activityName) {
                this.stateQuery.send();
            }
        },
    },
    computed: {
        computedFetchParams() {
            return this.planId + '_' + this.activityName;
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
        handleGetStationName(item) {
            let name = item;
            try {
                name = item.name;
            } catch (e) {}

            return name;
        },
        handleGetDepartmentName(item) {
            let name = item;
            try {
                const json = JSON.parse(item)[0];
                name = json.allName || json.name;
            } catch (e) {}

            return name;
        },
    },
};
</script>

<style></style>
