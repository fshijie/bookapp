<template>
    <div class="launch-approve ut-bg-form ut-min-h-full" style="min-height: calc(100% + 2rem)">
        <GeFormRenderer
            v-if="modelData.flowType !== 'handling'"
            ref="refForm"
            :items="dataFormRender.items"
            :readonly="dataFormRender.readonly"
            v-model="dataFormRender.value"
            :result.sync="dataFormRender.result"
            :origin-value="dataFormRender.originValue"
        />
        <!-- <div v-if="modelData.flowType === 'handling'" class="ut-p-4 ut-bg-white">
            <div class="ut-text-sm">厂站位置</div>
            <StationLineMapInput :value="modelData.stationGeo" only-show-map :show-name="modelData.stationName" :map-height="260" />
        </div> -->
        <div v-if="computedShowCheckPoint" class="ut-p-4 ut-bg-white ut-mt-4">
            <CheckPoint ref="refCheckPoint" :readonly="dataCheckPointReadonly" :queryParams="computedCheckPointParams" />
        </div>
        <div class="ut-p-4 ut-bg-white ut-mt-4" v-loading="dataIsFetchingFlow">
            <div class="ut-text-sm ut-pb-4">{{ dataFlowTitle }}</div>
            <TimelineFlow
                :items="dataTimelineFlow.items"
                @change="val => (dataTimelineFlow.value = val)"
                :editable="dataTimelineFlow.editable"
                :show-file="modelData.flowType === 'handling'"
                :files="dataFiles"
            />
        </div>
        <div v-if="modelData.flowType !== 'handling'" class="ut-p-4 ut-bg-white ut-mt-4">
            <div class="ut-text-sm ut-pb-4">附件</div>
            <ExUploader :readonly="dataFilesReadonly" :file-list="dataFiles" multiple />
        </div>
    </div>
</template>

<script>
import AuditApproveTempSave from './AuditApproveTempSave';
import GeFormRenderer from '@/components/form-provider/GeFormRenderer';
import TimelineFlow from '@/components/main/common/TimelineFlow';
import ExUploader from '@/components/extends/ExUploader';

// import StationLineMapInput from '@/components/main/station-line/StationLineMapInput.vue';

export default {
    name: 'AuditApproveCompleted',
    mixins: [AuditApproveTempSave],
    props: {
        modelData: {
            type: Object,
            default: () => ({
                modelId: '',
                flowType: '',
                formId: '',
                flowModelId: '',
                pid: '',
                tableName: '',
                taskId: '',
            }),
        },
    },
    components: {
        GeFormRenderer,
        TimelineFlow,
        ExUploader,
        // StationLineMapInput,
    },
    data() {
        return {
            dataCheckPointReadonly: true,
            dataFilesReadonly: true,
            dataFlowTitle: this.modelData.flowType === 'handling' ? '作业实施' : '审批意见',
            dataOldFiles: '[]',
            dataIsFetchingHistory: false,
            dataFormRender: {
                items: [],
                readonly: true,
                value: [],
                originValue: null,
                result: {},
            },
            dataTimelineFlow: {
                items: [],
                value: [],
                editable: false,
            },
        };
    },
    watch: {},
    methods: {
        // 获取审批历史意见
        async handleFetchingHistory(retry = 0) {
            this.dataIsFetchingFlow = true;
            try {
                const req = this.$axios.get('server/spFormType/findHisActivitiList', { params: { instanceId: this.modelData.pid } });
                const historyData = await req;
                this.dataTimelineFlow.items = historyData;
            } catch (error) {
                if (retry < 3) {
                    return this.handleFetchingHistory(++retry);
                }
            }
            this.dataIsFetchingFlow = false;
        },
        async handleFetching(retry = 0) {
            this.dataIsFetchingData = true;
            try {
                const formReq = this.$axios.get('server/spFormType/formList', { params: { pid: this.modelData.pid } });
                const dataReq = this.$axios.get('server/spFormType/echoDisplay', { params: { pid: this.modelData.pid } });
                this.handleFetchingHistory();
                const formItems = await formReq;
                const formData = await dataReq;

                this.dataFormRender.items = formItems;
                this.dataFormRender.originValue = (formData || {}).data || {};
                this.dataOldFiles = ((formData || {}).data || {})['附件'];
                this.dataFiles = JSON.parse(this.dataOldFiles || '[]');

                if (this.computedShowCheckPoint) {
                    this.dataCheckPointSuperviseId = ((formData || {}).data || {})['安全监督计划'];
                }
            } catch (error) {
                if (retry < 3) {
                    return this.handleFetching(++retry);
                }
            }
            this.dataIsFetchingData = false;
        },
        async emitSubmit(isInner = false) {},
        async emitTempSave(isInner = false) {},
    },
    created() {},
};
</script>

<style lang="less" scoped></style>
