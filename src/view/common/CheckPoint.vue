<template>
    <div v-loading="stateItems.loading" style="min-height: 300px;">
        <div v-for="(item, index) in stateItems.data.contentList" :key="'item_' + index" class="ut-flex ut-w-full ut-items-stretch">
            <div class="ut-flex-shrink-0 ut-flex ut-flex-col ut-items-center">
                <div>
                    <i class="el-icon-circle-check ut-text-lg ut-text-primary" />
                </div>
                <div class="ut-flex-1 ut-border-l ut-border-gray-700 ut-border-dashed"></div>
            </div>
            <div class="ut-flex-1">
                <div>【{{ stateItems.data.itemsName }}】</div>
                <div class="ut-text-info ut-pl-2 ut-text-sm ut-pt-2">
                    {{ item.inspectionContent }}
                </div>
                <el-radio-group :disabled="readonly" class="ut-pl-2 ut-pt-3 ut-pb-3" v-model="stateMutation.variables.data[index].flag">
                    <el-radio :label="0">不通过</el-radio>
                    <el-radio :label="1">通过</el-radio>
                    <el-radio :label="2">不存在</el-radio>
                </el-radio-group>
                <el-form v-show="stateMutation.variables.data[index].flag !== 1" class="ut-pl-2" label-position="left" label-width="130px" ref="form" :model="stateMutation.variables.data[index]">
                    <el-form-item required label="发现问题" prop="problem" :rules="computedRules" size="mini">
                        <el-input :disabled="readonly" v-model="stateMutation.variables.data[index].problem" />
                    </el-form-item>
                    <el-form-item required label="整改建议或要求" prop="suggestion" :rules="computedRules" size="mini">
                        <el-input :disabled="readonly" v-model="stateMutation.variables.data[index].suggestion" />
                    </el-form-item>
                    <el-form-item label="违章等级" prop="violationLevel" size="mini">
                        <el-select disabled class="ut-w-full" v-model="stateMutation.variables.data[index].violationLevel">
                            <el-option
                                v-for="item in computedViolationLevelOptions"
                                :key="'violation_level_' + item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="违章性质" prop="violationNature" :rules="computedRules" size="mini">
                        <el-select disabled class="ut-w-full" v-model="stateMutation.variables.data[index].violationNature">
                            <el-option
                                v-for="item in computedViolationNatureOptions"
                                :key="'violation_nature_' + item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属环节" required prop="link" :rules="computedRules" size="mini">
                        <el-select :disabled="readonly" class="ut-w-full" v-model="stateMutation.variables.data[index].link">
                            <el-option
                                v-for="item in computedLinkOptions"
                                :key="'violation_nature_' + item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="ut-pl-2">
                    <div class="ut-pb-2 ut-text-sm ut-text-info">附件</div>
                    <ExUploader :readonly="readonly" :file-list="stateMutation.variables.data[index].attachmentId" multiple />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ExUploader from '@/components/extends/ExUploader';

export default {
    name: 'CheckPoint',
    components: {
        ExUploader,
    },
    props: {
        readonly: {
            type: Boolean,
            default: false,
        },
        queryParams: {
            type: Object,
            default: () => ({
                superviseId: '',
            }),
        },
    },
    data() {
        return {
            stateItems: this.$ex.request({
                action: vars => this.$axios.get('business/tbInspectionItems/getItemsAndContents', { params: this.queryParams }),
                // action: vars =>
                //     Promise.resolve(
                //         JSON.parse(
                //             '[{"id":"5e7fd572d6c29019409e61b6edf4af14","createTime":"2020-07-07 19:23:06","updateTime":"2020-07-07 19:23:06","effect":1,"itemsName":"施工方案","templateId":"e748af53713c80a31862e8748dc15eee","sort":1,"contentList":[{"id":"1d0471cc772e1f3ae86de3e3c120841f","createTime":"2020-07-07 19:25:23","updateTime":"2020-07-07 19:27:06","effect":1,"itemsId":"5e7fd572d6c29019409e61b6edf4af14","inspectionContent":"编制的施工方案是否具有实用性、指导性和可操作性","inspectionBasis":"生产作业管理业务指导书","inspectionMethod":"查阅资料","violationContent":"查阅资料\\t1.未编制施工方案；2.施工方案不具有实用性、指导性和可操作性","violationNature":"3","violationLevel":"4","sort":3,"problemList":[]},{"id":"6778a98e56a0bc395153bdc496347db5","createTime":"2020-07-07 19:23:55","updateTime":"2020-07-07 19:27:41","effect":1,"itemsId":"5e7fd572d6c29019409e61b6edf4af14","inspectionContent":"因工作需要进入变电站进行现场勘查、熟悉设备，无需办理工作票，但是否由运行人员陪同。","inspectionBasis":"生产作业管理业务指导书","inspectionMethod":"场检查","violationContent":"现场勘查、熟悉设备，无运行人员陪同。","violationNature":"1","violationLevel":"2","sort":1,"problemList":[]},{"id":"97c962015043f750fc82f7784ee9e391","createTime":"2020-07-07 19:26:32","updateTime":"2020-07-07 19:27:26","effect":1,"itemsId":"5e7fd572d6c29019409e61b6edf4af14","inspectionContent":"设备所属单位检修部门编制的施工方案是否经本部门自审、项目责任单位审批","inspectionBasis":"生产作业管理业务指导书","inspectionMethod":"管理性","violationContent":"施工方案未经部门自审、项目责任单位审批","violationNature":"3","violationLevel":"3","sort":4,"problemList":[]},{"id":"b94e5f40db8204e8420656c3bed0ee3d","createTime":"2020-07-07 19:24:39","updateTime":"2020-07-07 19:27:34","effect":1,"itemsId":"5e7fd572d6c29019409e61b6edf4af14","inspectionContent":"施工方案编制前是否调阅相关的风险数据，对施工（作业）现场进行勘查，开展风险评估。","inspectionBasis":"生产作业管理业务指导书","inspectionMethod":"查阅资料","violationContent":"1.未开展现场勘查;2.未根据现场勘查结果开展作业风险评估","violationNature":"3","violationLevel":"3","sort":2,"problemList":[]}]}]'
                //         )
                //     ),
                variables: {
                    superviseId: '',
                },
                initData: [
                    {
                        contentList: [],
                        itemsName: '',
                    },
                ],
                update: fullData => (fullData || [])[0] || {},
                onSuccess: state => {
                    this.stateMutation.variables.data = state.data.contentList.map(item => {
                        const data = (item.problemList || [])[0] || {};
                        let attachmentId = [];

                        try {
                            attachmentId = JSON.parse(data.attachmentId || '[]');
                        } catch (err) {}

                        return {
                            inspectionContentId: data.inspectionContentId || '',
                            superviseId: this.queryParams.superviseId || '',
                            flag: data.flag || 0,
                            problem: data.problem || '',
                            suggestion: data.suggestion || '',
                            link: data.link || '1',
                            attachmentId,
                            inspectionContentId: item.id || '',
                            violationLevel: item.violationLevel || '1',
                            violationNature: item.violationNature || '1',
                        };
                    });
                },
                extra: {},
                skip: true,
            }),
            stateMutation: this.$ex.request({
                action: vars => {
                    console.log(
                        vars.data.map(data => {
                            return {
                                ...data,
                                attachmentId: data.attachmentId && data.attachmentId.length > 0 ? JSON.stringify(data.attachmentId) : '',
                            };
                        })
                    );
                    return Promise.resolve({});
                    // return this.$axios.post(
                    //     'business/tbInspectionItems/getItemsAndContents',
                    //     vars.data.map(data => {
                    //         return {
                    //             ...data,
                    //             attachmentId: data.attachmentId && data.attachmentId.length > 0 ? JSON.stringify(data.attachmentId) : '',
                    //         };
                    //     })
                    // );
                },
                variables: {
                    data: [],
                },
                initData: {},
                extra: {},
                skip: true,
            }),
        };
    },
    watch: {
        'queryParams.superviseId': {
            immediate: true,
            handler(value) {
                if (value) {
                    this.stateItems.send();
                }
            }
        }
    },
    computed: {
        computedRules() {
            return [
                {
                    required: true,
                    message: '此项为必填',
                },
            ];
        },
        computedViolationLevelOptions() {
            return [
                { label: 'A类', value: '1' },
                { label: 'B类', value: '2' },
                { label: 'C类', value: '3' },
                { label: 'D类', value: '4' },
            ];
        },
        computedViolationNatureOptions() {
            return [
                { label: '作业性', value: '1' },
                { label: '装置性', value: '2' },
                { label: '管理性', value: '3' },
            ];
        },
        computedLinkOptions() {
            return [
                { label: 'S（策划）', value: '1' },
                { label: 'E（执行）', value: '2' },
                { label: 'C（依从）', value: '3' },
                { label: 'P（绩效）', value: '4' },
            ];
        },
    },
    methods: {
        async emitValidate() {
            let valid = true;

            const forms = this.$refs.form || [];
            for (let i = 0; i < forms.length; i++) {
                try {
                    if (this.stateMutation.variables.data[i].flag !== 1) {
                        await forms[i].validate();
                    }
                } catch (err) {
                    valid = false;
                }
            }

            if (!valid) {
                throw new Error('请正确填写检查点表单数据');
            }

            return valid;
        },
        emitGetData() {
            return this.stateMutation.variables.data.map(data => {
                const isFlagPass = data.flag === 1;
                return {
                    ...data,
                    problem: isFlagPass ? '' : data.problem,
                    suggestion: isFlagPass ? '' : data.suggestion,
                    link: isFlagPass ? 1 : data.link,
                    attachmentId: data.attachmentId && data.attachmentId.length > 0 ? JSON.stringify(data.attachmentId) : '',
                };
            });
        },
    },
};
</script>

<style lang="less" scoped></style>
