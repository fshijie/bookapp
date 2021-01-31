<template>
    <div class="launch-approve ut-bg-form ut-min-h-full">
        <GeFormRenderer
            ref="refForm"
            :items="dataFormRender.items"
            :readonly="dataFormRender.readonly"
            v-model="dataFormRender.value"
            :result.sync="dataFormRender.result"
            :origin-value="dataFormRender.originValue"
        />
        <div v-if="computedShowCheckPoint" class="ut-p-4 ut-bg-white ut-mt-4">
            <CheckPoint ref="refCheckPoint" :readonly="dataCheckPointReadonly" :syncCheckPointData.sync="dataCheckPointData" :queryParams="computedCheckPointParams" />
        </div>
        <div class="ut-p-4 ut-bg-white ut-mt-4" v-loading="dataIsFetchingFlow">
            <div class="ut-text-sm ut-pb-4">{{ dataFlowTitle }}</div>
            <TimelineFlow :items="dataTimelineFlow.items" @change="val => (dataTimelineFlow.value = val)" :editable="dataTimelineFlow.editable" />
        </div>
        <div class="ut-p-4 ut-bg-white ut-mt-4">
            <div class="ut-text-sm ut-pb-4">附件</div>
            <ExUploader :readonly="dataFilesReadonly" :file-list="dataFiles" multiple />
        </div>
    </div>
</template>

<script>
import GeFormRenderer from '@/components/form-provider/GeFormRenderer';
import TimelineFlow from '@/components/main/common/TimelineFlow';
import ExUploader from '@/components/extends/ExUploader';
import CheckPoint from '@/components/main/common/CheckPoint';

export default {
    name: 'LaunchApprove',
    props: {
        syncFetching: {
            type: Boolean,
            default: false
        },
        syncSubmiting: {
            type: Boolean,
            default: false
        },
        syncTempSaveSubmiting: {
            type: Boolean,
            default: false
        },
        syncFetchingFlow: {
            type: Boolean,
            default: false
        },
        syncFlowItems: {
            type: Array,
            default: () => []
        },
        syncResult: {
            type: Object,
            default: () => ({})
        },
        modelData: {
            type: Object,
            default: () => ({
                modelId: '',
                flowModelId: '',
                checkPointParams: {
                    superviseId: '',
                }
            })
        },
        intervalCache: {
            type: Boolean,
            default: false
        },
        // 初始值
        originValue: {
            type: Object,
            default: null
        }
    },
    components: {
        GeFormRenderer,
        TimelineFlow,
        ExUploader,
        CheckPoint,
    },
    data() {
        return {
            dataCheckPointData: [],
            dataCheckPointReadonly: false,
            dataIsDestroyed: false,
            dataFilesReadonly: false,
            dataFlowTitle: '审批流程',
            dataIsFetchingData: true,
            dataFormRender: {
                items: [],
                readonly: false,
                value: [],
                originValue: this.originValue ? this._.cloneDeep(this.originValue) : null,
                result: {}
            },
            dataTimelineFlow: {
                items: [],
                value: [],
                editable: true
            },
            dataFiles: [],
            dataIsSubmiting: false,
            dataIsTempSaveSubmiting: false,
            dataIsFetchingFlow: false,
            dataIntervalCacheTimer: null,
            debounceHandlePostIntervalCache: this._.debounce(this.handlePostIntervalCache, 5000),
            dataInitFetched: false
        };
    },
    watch: {
        'dataFormRender.result': {
            immediate: true,
            handler(val) {
                this.$emit('update:syncResult', val);

                if (this.dataInitFetched) {
                    this.debounceHandlePostIntervalCache(false);
                }
            }
        },
        dataFiles() {
            if (this.dataInitFetched) {
                this.debounceHandlePostIntervalCache(false);
            }
        },
        dataIsFetchingData: {
            immediate: true,
            handler(val) {
                this.$emit('update:syncFetching', val);
            }
        },
        dataIsSubmiting: {
            immediate: true,
            handler(val) {
                this.$emit('update:syncSubmiting', val);
            }
        },
        dataIsTempSaveSubmiting: {
            immediate: true,
            handler(val) {
                this.$emit('update:syncTempSaveSubmiting', val);
            }
        },
        dataIsFetchingFlow: {
            immediate: true,
            handler(val) {
                this.$emit('update:syncFetchingFlow', val);
            }
        },
        'dataTimelineFlow.items': {
            immediate: true,
            handler(val) {
                this.$emit('update:syncFlowItems', val);
            }
        }
    },
    computed: {
        computedCheckPointParams() {
            return this.modelData.checkPointParams;
        },
        computedShowCheckPoint() {
            return this.modelData.modelId === '2cd46aacd4b441849cf17449c99f5309';
        },
        computedCacheKey() {
            return `process:${this.modelData.modelId}`;
        }
    },
    methods: {
        // 获取提交数据
        handleGetTempSaveData(saveType) {
            return {
                approvalSubmitData: this.dataTimelineFlow.value,
                createrUserid: this.$store.getters.userId,
                data: {
                    ...this.dataFormRender.result,
                    附件: JSON.stringify(this.dataFiles),
                    __check_point_data__: this.computedShowCheckPoint && !this.dataCheckPointReadonly ? this.$refs.refCheckPoint.emitGetData() : undefined,
                },
                id: '',
                modelId: this.modelData.modelId,
                saveType,
            };
        },
        // 获取审批流程的提交参数
        handleGetFlowParam() {
            return {
                modelId: this.modelData.flowModelId,
                variableMap: {
                    ...this.dataFormRender.result,
                    发起人: this.$store.getters.userId
                },
                departmentId: ''
            };
        },
        async handleFetchingFLow(retry = 0) {
            this.dataIsFetchingFlow = true;
            try {
                const flowReq = this.$axios.post('server/SpWorkflow/getAct', this.handleGetFlowParam());
                const flowItems = await flowReq;
                this.dataTimelineFlow.items = flowItems;
            } catch (error) {
                if (retry < 3) {
                    return this.handleFetchingFLow(++retry);
                }
            }
            this.dataIsFetchingFlow = false;
        },
        // 缓存填写数据
        handleIntervalCache() {
            // if (this.dataIsDestroyed) {
            //     return;
            // }
            // if (this.dataIntervalCacheTimer) {
            //     clearTimeout(this.dataIntervalCacheTimer);
            // }
            // this.dataIntervalCacheTimer = setTimeout(() => {
            //     this.handlePostIntervalCache(true);
            // }, 1000 * 30);
        },
        async handlePostIntervalCache(withTimer = false) {
            if (this.dataIsDestroyed) {
                return;
            }

            try {
                // 如果正在提交中，则不缓存数据，只使用定时待下次判断（如提交失败）
                if (this.dataIsSubmiting || this.dataIsTempSaveSubmiting) {
                    this.dataIntervalCacheTimer = null;
                    // return this.handleIntervalCache();
                    return;
                }
                const value = JSON.stringify({
                    ...this.dataFormRender.result,
                    附件: this.dataFiles
                });
                await this.$axios.post('admin/cache/set', {
                    key: this.computedCacheKey,
                    value,
                    expire: 0
                });
                this.$message({
                    message: '已缓存',
                    type: 'success',
                    showClose: true,
                    duration: 2000
                });

                // if (withTimer) {
                //     this.dataIntervalCacheTimer = null;
                //     this.handleIntervalCache();
                // }
            } catch (error) {}
        },
        async handleFetching(retry = 0) {
            this.dataIsFetchingData = true;
            try {
                const formReq = this.$axios.get('server/SpModel/getFormList', { params: { modelId: this.modelData.modelId } });
                const formItems = await formReq;

                this.dataFormRender.items = formItems;

                // 设置初始值则不使用缓存
                if (this.intervalCache && !this.originValue) {
                    const cacheData = await this.$axios.get('admin/cache/get', { params: { key: this.computedCacheKey } });

                    if (cacheData) {
                        try {
                            const parsedData = JSON.parse(cacheData);
                            this.dataFormRender.originValue = parsedData;
                            this.dataFiles = parsedData['附件'];

                            this.$message({
                                message: '已使用缓存数据',
                                // type: 'success',
                                showClose: true,
                                duration: 3000
                            });
                        } catch (error) {
                            // do nothind
                        }
                    }

                    // this.handleIntervalCache();

                    this.$nextTick(() => (this.dataInitFetched = true));
                }

                await new Promise(res => {
                    // 需要等下一个事件循环再放入异步中以保证获取到数据
                    this.$nextTick(() =>
                        setTimeout(() => {
                            // 由于自定义表单渲染器设置初始值修改value是宏队列异步任务，因此为了在之后执行该操作，在相同宏队列中再放入一个宏队列中执行
                            setTimeout(() => {
                                this.handleFetchingFLow();
                                res();
                            }, 0);
                        }, 0)
                    );
                });
            } catch (error) {
                if (retry < 3) {
                    return this.handleFetching(++retry);
                }
            }
            this.dataIsFetchingData = false;
        },
        async handleValidateP() {
            try {
                await this.$refs.refForm.emitValidateP();
            } catch (error) {
                this.$message({
                    message: '请正确填写表单',
                    type: 'warning',
                    showClose: true
                });
                throw error;
            }
        },
        handleSuccess(typeText) {
            this.$emit('success');
            this.$message({
                message: typeText + '成功',
                type: 'success',
                showClose: true
            });
        },
        async emitSubmit(isInner = false) {
            this.dataIsSubmiting = true;
            try {
                await this.handleValidateP();

                if (this.computedShowCheckPoint && !this.dataCheckPointReadonly) {
                    await this.$refs.refCheckPoint.emitValidate();
                }

                await this.$axios.post('server/spFormType/custom/save', this.handleGetTempSaveData(1));
                this.handleSuccess('提交');
            } catch (error) {
                if (!isInner) {
                    this.dataIsSubmiting = false;
                    throw error;
                }
            }
            this.dataIsSubmiting = false;
        },
        async emitTempSave(isInner = false) {
            this.dataIsTempSaveSubmiting = true;
            try {
                await this.handleValidateP();

                if (this.computedShowCheckPoint && !this.dataCheckPointReadonly) {
                    await this.$refs.refCheckPoint.emitValidate();
                }

                await this.$axios.post('server/spFormType/custom/save', this.handleGetTempSaveData(0));
                this.handleSuccess('暂存');
            } catch (error) {
                if (!isInner) {
                    this.dataIsTempSaveSubmiting = false;
                    throw error;
                }
            }
            this.dataIsTempSaveSubmiting = false;
        },
        init() {
            this.handleFetching();
        },
        emitRefresh() {
            this.init();
        }
    },
    created() {
        this.init();
        this.dataIsDestroyed = false;
    },
    beforeDestroy() {
        this.dataIsDestroyed = true;
        if (this.dataIntervalCacheTimer) {
            clearTimeout(this.dataIntervalCacheTimer);
            this.dataIntervalCacheTimer = null;
        }
    }
};
</script>

<style lang="less" scoped></style>
