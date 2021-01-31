<template>
    <div class="org-index ut-flex ut-bg-white ut-h-full ut-items-stretch">
        <div class="ut-flex-shrink-0 ut-p-5 ut-border-r ut-border-gray-200 ut-h-full ut-flex ut-flex-col" style="width: 320px;">
            <div class="ut-pb-5 ut-flex-shrink-0">
                <el-input placeholder="请输入名称搜索" clearable v-model="stateSearch.variables.name" size="small" />
            </div>
            <div
                class="ut-flex-grow ut-relative"
                :class="computedSidebarLoading ? 'ut-overflow-hidden' : 'ut-overflow-y-auto'"
                style="min-height: 150px;"
                v-loading="computedSidebarLoading"
            >
                <el-tree
                    v-show="!stateSearch.variables.name"
                    ref="refTree"
                    class="org-index__tree"
                    :expand-on-click-node="false"
                    default-expand-all
                    node-key="id"
                    :data="stateTree.data"
                    :props="stateTree.extra"
                    @node-click="handleNodeClick"
                ></el-tree>
                <div v-show="stateSearch.variables.name">
                    <template v-if="!isPicker || (isPicker && pickerOptions.type === 'org')">
                        <div
                            v-if="!stateSearch.data.orgList || stateSearch.data.orgList.length === 0"
                            class="ut-text-center ut-text-info ut-p-3 ut-w-full"
                        >
                            暂无数据
                        </div>
                        <template v-else>
                            <div class="ut-px-5 ut-py-2 ut-border-t first:ut-border-t-0 ut-bg-gray-200 ut-text-sm ut-font-bold">
                                机构
                            </div>
                            <div
                                v-for="item in stateSearch.data.orgList"
                                :key="'org_item_' + item.id"
                                class="ut-cursor-pointer ut-px-5 ut-py-3 ut-border-t first:ut-border-t-0 ut-bg-gray-100 ut-text-sm"
                                :class="isPicker && !handleCouldSelectOrg(item) ? 'ut-text-info ut-cursor-not-allowed' : ''"
                                @click="handleSearchClick(item, 'org')"
                            >
                                <el-checkbox
                                    class="!ut-mr-2"
                                    v-if="isPicker"
                                    @mousedown.stop
                                    :value="handleValueIncludedWithId(item.id)"
                                    @input="handleSearchClick(item, 'org')"
                                    :disabled="isPicker && !handleCouldSelectOrg(item)"
                                ></el-checkbox>
                                <span>{{ item.allName || item.name }}</span>
                                <el-tag size="mini">{{ handleGetOrgType(item) }}</el-tag>
                            </div>
                        </template>
                    </template>
                    <template v-if="!isPicker || (isPicker && pickerOptions.type === 'user')">
                        <div
                            v-if="!stateSearch.data.userList || stateSearch.data.userList.length === 0"
                            class="ut-text-center ut-text-info ut-p-3 ut-w-full"
                        >
                            暂无数据
                        </div>
                        <template v-else>
                            <div class="ut-px-5 ut-py-2 ut-border-t first:ut-border-t-0 ut-bg-gray-200 ut-text-sm ut-font-bold">
                                人员
                            </div>
                            <div
                                v-for="item in stateSearch.data.userList"
                                :key="'user_item_' + item.id"
                                class="ut-cursor-pointer ut-px-5 ut-py-3 ut-border-t first:ut-border-t-0 ut-bg-gray-100 ut-text-sm"
                                @click="handleSearchClick(item, 'user')"
                            >
                                <el-checkbox
                                    class="!ut-mr-2"
                                    v-if="isPicker"
                                    @mousedown.stop
                                    :value="handleValueIncludedWithId(item.id)"
                                    @input="handleSearchClick(item, 'user')"
                                ></el-checkbox>
                                <span>{{ `${item.allOrgName}/${item.name}` }}</span>
                            </div>
                        </template>
                    </template>
                </div>
            </div>
        </div>
        <div
            class="ut-flex-1 ut-p-5 ut-h-full ut-overflow-y-auto ut-border-l ut-border-gray-200 ut--ml-px"
            v-loading="stateTree.loading || stateOrg.loading"
        >
            <div v-if="isPicker" class="ut-border ut-rounded-md ut-p-2 ut-flex ut-flex-wrap ut-mb-2">
                <div v-if="!value || value.length === 0" class="ut-text-center ut-text-info ut-p-1 ut-w-full ut-leading-6">
                    暂无选择数据
                </div>
                <template v-else>
                    <div :key="'tag_' + tag.id" v-for="tag in value" class="ut-p-1">
                        <el-tag closable :disable-transitions="false" @close="handleRemoveTag(tag)">
                            {{ tag.allName || tag.name }}
                        </el-tag>
                    </div>
                </template>
            </div>
            <div class="ut-text-2xl ut-flex ut-items-center">
                {{ computedCurrentOrg.name }}
                <el-button
                    v-if="!isPicker && $auth.check('org:edit')"
                    size="mini"
                    class="!ut-ml-2"
                    icon="el-icon-edit"
                    @click="handleEditOrg(computedCurrentOrg)"
                >
                    编辑
                </el-button>
            </div>
            <el-breadcrumb separator="/" class="ut-mt-4">
                <el-breadcrumb-item v-for="(item, index) in computedBreadcrumb" :key="item.id">
                    <span :class="index === computedBreadcrumb.length - 1 ? '' : 'ut-font-bold ut-cursor-pointer'" @click="handleNodeClick(item)">
                        {{ item.name }}
                    </span>
                </el-breadcrumb-item>
            </el-breadcrumb>
            <div v-if="isPicker && pickerOptions.type === 'org'" class="ut-mt-4 ut-p-5 ut-bg-gray-200">
                <!-- <div class="ut-flex ut-items-center ut-pb-5">
                    <div class="ut-text-lg"><i class="el-icon-s-grid" />当前机构</div>
                </div> -->
                <div class="ut-bg-white">
                    <div
                        class="ut-text-sm ut-flex ut-justify-between ut-px-5 ut-py-4 ut-border-t first:ut-border-t-0 hover:ut-bg-gray-100 ut-cursor-pointer"
                        :class="isPicker && !handleCouldSelectOrg(computedCurrentOrg) ? 'ut-text-info ut-bg-gray-100 ut-cursor-not-allowed' : ''"
                        @click="handleSearchClick(computedCurrentOrg, 'org')"
                    >
                        <div>
                            <el-checkbox
                                v-if="isPicker"
                                class="!ut-mr-2"
                                :value="handleValueIncludedWithId(computedCurrentOrg.id)"
                                @mousedown.stop
                                @input="handleSearchClick(computedCurrentOrg, 'org')"
                                :disabled="isPicker && !handleCouldSelectOrg(computedCurrentOrg)"
                            ></el-checkbox>
                            <span>{{ computedCurrentOrg.name }} (当前机构)</span> <el-tag size="mini">{{ handleGetOrgType(computedCurrentOrg) }}</el-tag>
                        </div>
                        <div><i class="el-icon-arrow-right" /></div>
                    </div>
                </div>
            </div>
            <div v-if="!isPicker || (isPicker && pickerOptions.type === 'org')" class="ut-mt-4 ut-p-5 ut-bg-gray-200">
                <div class="ut-flex ut-items-center ut-pb-5">
                    <div class="ut-text-lg"><i class="el-icon-s-grid" />下级机构</div>
                    <div v-if="!isPicker" class="ut-flex ut-ml-auto">
                        <template v-if="sortable.orgDragEnable">
                            <el-button key="btn_cancel_org_sort" @click="handleSortCancel('org')" size="mini" icon="el-icon-sort">取消</el-button>
                            <el-button @click="handleSortSubmit('org')" size="mini" icon="el-icon-sort" type="primary">确定</el-button>
                        </template>
                        <el-button
                            key="btn_start_org_sort"
                            v-else-if="!sortable.userDragEnable && $auth.check('org:sort')"
                            @click="handleSortStart('org')"
                            size="mini"
                            icon="el-icon-sort"
                        >
                            调整顺序
                        </el-button>

                        <el-button
                            v-if="!sortable.orgDragEnable && $auth.check('org:add')"
                            size="mini"
                            type="success"
                            icon="el-icon-plus"
                            @click="handleAddOrg"
                            >添加子机构
                        </el-button>
                    </div>
                </div>
                <div class="ut-bg-white">
                    <!-- <el-checkbox-group v-model="box" class="ut-w-full org-index__checkbox"> -->
                    <div
                        v-if="!stateOrg.data.orgList || stateOrg.data.orgList.length === 0"
                        class="ut-text-sm ut-flex ut-justify-center ut-px-5 ut-py-4 ut-border-t first:ut-border-t-0"
                    >
                        暂无数据
                    </div>
                    <template v-else>
                        <draggable
                            @start="sortable.orgDrag = true"
                            @end="sortable.orgDrag = false"
                            :animation="200"
                            v-model="stateOrg.data.orgList"
                            handle=".item-draggable"
                        >
                            <transition-group type="transition" :name="!sortable.orgDrag ? 'flip-list' : null">
                                <div
                                    v-for="item in stateOrg.data.orgList"
                                    :key="'org_' + item.id"
                                    class="ut-text-sm ut-flex ut-justify-between ut-px-5 ut-py-4 ut-border-t first:ut-border-t-0 hover:ut-bg-gray-100"
                                    :class="[isPicker ? 'ut-cursor-pointer' : '', isPicker && !handleCouldSelectOrg(item) ? 'ut-text-info ut-bg-gray-100 ut-cursor-not-allowed' : '']"
                                    @click="handleSearchClick(item, 'org')"
                                >
                                    <div>
                                        <el-checkbox
                                            v-if="isPicker"
                                            class="!ut-mr-2"
                                            :value="handleValueIncludedWithId(item.id)"
                                            @mousedown.stop
                                            @input="handleSearchClick(item, 'org')"
                                            :disabled="isPicker && !handleCouldSelectOrg(item)"
                                        ></el-checkbox>
                                        <i v-if="!isPicker && sortable.orgDragEnable" class="item-draggable fa fa-reorder ut-mr-2 ut-cursor-move" />
                                        <span>{{ item.name }} </span>
                                        <el-tag size="mini">{{ handleGetOrgType(item) }}</el-tag>
                                    </div>
                                    <div><i class="el-icon-arrow-right" /></div>
                                </div>
                            </transition-group>
                        </draggable>
                    </template>
                    <!-- </el-checkbox-group> -->
                </div>
            </div>
            <div v-if="!isPicker || (isPicker && pickerOptions.type === 'user')" class="ut-mt-5 ut-p-5 ut-bg-gray-200">
                <div class="ut-flex ut-items-center ut-pb-5">
                    <div class="ut-text-lg"><i class="el-icon-user-solid" />机构人员</div>
                    <div v-if="!isPicker" class="ut-flex ut-ml-auto">
                        <template v-if="sortable.userDragEnable">
                            <el-button key="btn_cancel_user_sort" @click="handleSortCancel('user')" size="mini" icon="el-icon-sort">取消</el-button>
                            <el-button @click="handleSortSubmit('user')" size="mini" icon="el-icon-sort" type="primary">确定</el-button>
                        </template>
                        <el-button
                            key="btn_start_user_sort"
                            v-else-if="!sortable.orgDragEnable && $auth.check('user:sort')"
                            @click="handleSortStart('user')"
                            size="mini"
                            icon="el-icon-sort"
                        >
                            调整顺序
                        </el-button>
                        <el-button
                            v-if="!sortable.userDragEnable && $auth.check('user:add')"
                            size="mini"
                            type="success"
                            icon="el-icon-plus"
                            @click="handleAddUser"
                        >
                            添加人员
                        </el-button>
                    </div>
                </div>
                <div class="ut-bg-white">
                    <!-- <el-checkbox-group v-model="box" class="ut-w-full org-index__checkbox"> -->
                    <div
                        v-if="!stateOrg.data.userList || stateOrg.data.userList.length === 0"
                        class="ut-text-sm ut-flex ut-justify-center ut-px-5 ut-py-4 ut-border-t first:ut-border-t-0"
                    >
                        暂无数据
                    </div>
                    <template v-else>
                        <draggable
                            @start="sortable.userDrag = true"
                            @end="sortable.userDrag = false"
                            :animation="200"
                            v-model="stateOrg.data.userList"
                            handle=".item-draggable"
                        >
                            <transition-group type="transition" :name="!sortable.userDrag ? 'flip-list' : null">
                                <div
                                    v-for="item in stateOrg.data.userList"
                                    :key="'user_' + item.id"
                                    class="ut-text-sm ut-flex ut-justify-between ut-px-5 ut-py-4 ut-border-t first:ut-border-t-0 hover:ut-bg-gray-100"
                                    :class="isPicker ? 'ut-cursor-pointer' : ''"
                                    @click="handleSearchClick(item, 'user')"
                                >
                                    <div>
                                        <el-checkbox
                                            v-if="isPicker"
                                            class="!ut-mr-2"
                                            :value="handleValueIncludedWithId(item.id)"
                                            @mousedown.stop
                                            @input="handleSearchClick(item, 'user')"
                                        ></el-checkbox>
                                        <i v-if="!isPicker && sortable.userDragEnable" class="item-draggable fa fa-reorder ut-mr-2 ut-cursor-move" />
                                        <span>{{ item.name }} </span>
                                        <el-tag size="mini" v-if="isHeader(item.id)">主管</el-tag>
                                    </div>
                                    <div><i class="el-icon-arrow-right" /></div>
                                </div>
                            </transition-group>
                        </draggable>
                    </template>
                    <!-- </el-checkbox-group> -->
                </div>
            </div>
        </div>

        <ex-drawer
            :visible.sync="stateMutateOrg.extra.layer.show"
            :title="stateMutateOrg.extra.layer.title"
            :close-on-press-escape="false"
            :wrapper-closable="false"
            size="500px"
            destroy-on-close
            :loading="stateMutateOrg.loading"
        >
            <template #default="{ closeDrawer }">
                <el-form
                    ref="refMutateOrg"
                    :model="stateMutateOrg.variables"
                    :inline="false"
                    :validate-on-rule-change="false"
                    :label-position="$store.getters.labelPosition"
                >
                    <el-form-item prop="name" label="机构名称" label-width="100px" :rules="[{ required: true, message: '机构名称为必填' }]">
                        <el-input v-model="stateMutateOrg.variables.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item prop="orgType" label="机构类型" label-width="100px" :rules="[{ required: true, message: '机构类型为必填' }]">
                        <el-select v-model="stateMutateOrg.variables.orgType" placeholder="请选择">
                            <el-option label="单位" value="0"></el-option>
                            <el-option label="部门" value="1"></el-option>
                            <el-option label="班组" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="header" label="部门主管" label-width="100px" :rules="[]">
                        <el-select v-model="computedHeader" multiple placeholder="请选择">
                            <el-option v-for="item in stateOrgMember.data" :key="'user'+item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="leader" label="分管领导" label-width="100px">
                        <el-select v-model="stateMutateOrg.variables.leader" placeholder="请选择">
                            <el-option v-for="item in stateAllUser.data" :key="'user'+item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="parentId" label="父级机构" label-width="100px" :rules="[{ required: true, message: '父级机构为必填' }]">
                        <OrgSelectInput v-model="stateMutateOrg.variables.parentId" :flatenTree="computedTreeFlaten"></OrgSelectInput>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer="{ closeDrawer, loading }">
                <div class="ut-text-center">
                    <el-button type="info" plain @click="closeDrawer" :disabled="stateMutateOrg.loading">
                        取消
                    </el-button>
                    <el-button type="primary" :loading="stateMutateOrg.loading" @click="handleSubmitOrg()">
                        提交
                    </el-button>
                    <el-button
                        v-if="stateMutateOrg.extra.type == 'edit' && $auth.check('org:delete')"
                        type="danger"
                        :loading="stateMutateOrg.loading"
                        @click="handleDeleteOrg(stateMutateOrg.variables.id)"
                    >
                        删除
                    </el-button>
                </div>
            </template>
        </ex-drawer>

        <ex-drawer
            :visible.sync="stateMutateUser.extra.layer.show"
            :title="stateMutateUser.extra.layer.title"
            :close-on-press-escape="false"
            :wrapper-closable="false"
            size="500px"
            destroy-on-close
            :loading="stateMutateUser.loading"
        >
            <template #default="{ closeDrawer }">
                <el-form
                    ref="refMutateUser"
                    :model="stateMutateUser.variables"
                    :inline="false"
                    :validate-on-rule-change="false"
                    :label-position="$store.getters.labelPosition"
                >
                    <el-form-item
                        v-if="stateMutateUser.extra.type === 'add'"
                        prop="userName"
                        label="用户名"
                        label-width="120px"
                        :rules="[{ required: true, message: '用户名为必填项' }]"
                    >
                        <el-input v-model="stateMutateUser.variables.userName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item v-else prop="userName" label="用户名" label-width="120px">
                        {{ stateMutateUser.variables.userName }}
                    </el-form-item>
                    <el-form-item prop="name" label="姓名" label-width="120px" :rules="[{ required: true, message: '姓名为必填项' }]">
                        <el-input v-model="stateMutateUser.variables.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item prop="orgId" label="所属机构" label-width="100px" :rules="[{ required: true, message: '所属机构为必填' }]">
                        <OrgSelectInput v-model="stateMutateUser.variables.orgId" :flatenTree="computedTreeFlaten"></OrgSelectInput>
                    </el-form-item>
                    <el-form-item
                        v-if="stateMutateUser.extra.type === 'add'"
                        prop="password"
                        label="密码"
                        label-width="120px"
                        :rules="stateMutateUser.extra.type === 'add' ? [{ required: true, message: '密码为必填项' }] : []"
                    >
                        <el-input v-model="stateMutateUser.variables.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item prop="permissions" label="设置角色" label-width="120px">
                        <user-give-roles
                            style="display: inline-block;width: 100%;"
                            v-model="stateMutateUser.variables.rolePlusList"
                            :options="rolesOptions"
                        ></user-give-roles>
                    </el-form-item>
                </el-form>
            </template>
            <span slot="footer" class="dialog-footer">
                <div class="ut-text-center">
                    <el-button :disabled="stateMutateUser.loading" @click="stateMutateUser.extra.layer.show = false">取消</el-button>
                    <el-button type="primary" :loading="stateMutateUser.loading" @click="handleSubmitUser">确定</el-button>
                    <el-button
                        v-if="stateMutateUser.extra.type == 'edit' && $auth.check('user:delete')"
                        type="danger"
                        :loading="stateMutateUser.loading"
                        @click="handleDeleteUser(stateMutateUser.id)"
                    >
                        删除
                    </el-button>
                </div>
            </span>
        </ex-drawer>
    </div>
</template>

<script>
import _ from 'lodash';
import Draggable from 'vuedraggable';

import OrgSelectInput from './org/OrgSelectInput.vue';
import UserGiveRoles from '../settings/UserGiveRoles';

export default {
    name: 'OrgIndex',
    components: {
        UserGiveRoles,
        Draggable,
        OrgSelectInput,
    },
    props: {
        isPicker: {
            type: Boolean,
            default: false,
        },
        pickerOptions: {
            type: Object,
            default: () => ({
                type: 'org',
                multiple: true,
            }),
        },
        value: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            sortable: {
                // 机构排序
                orgDragEnable: false,
                orgDrag: false,
                orgOriginData: [],
                orgLoadingInstance: null,

                // 人员排序
                userDragEnable: false,
                userDrag: false,
                userOriginData: [],
                userLoadingInstance: null,
            },
            // 机构排序
            stateOrgSort: this.$ex.request({
                action: vars => this.$axios.post('admin/tbOrg/updateBatch', vars.data),
                variable: { data: [] },
                initData: [],
                onSuccess: state => {
                    this.sortable.orgDragEnable = false;
                    this.stateOrg.send();
                },
                skip: true,
            }),
            // 人员排序
            stateUserSort: this.$ex.request({
                action: vars => this.$axios.post('admin/tbUser/updateBatch', vars.data),
                variable: { data: [] },
                initData: [],
                onSuccess: state => {
                    this.sortable.userDragEnable = false;
                    this.stateOrg.send();
                },
                skip: true,
            }),
            stateMutateUserRoles: this.$ex.request({
                action: (vars, {}) => {
                    return this.$axios.post('admin/tbRoleUser/all', vars);
                },
                variable: {},
                initData: {},
                onSuccess: (state) => {
                    this.userRoles = state.data;
                },
                skip: true,
            }),
            // 结构树
            stateTree: this.$ex.request({
                action: () => this.$axios.get('admin/vOrg/getTree', { params: { rootCode: this.pickerOptions.topLevel || '-1', orgType: '' } }),
                extra: {
                    children: 'children',
                    label: 'name',
                },
                initData: [],
                onSuccess: state => {
                    const org = (state.data || [])[0] || {};
                    this.dataCurrentOrgId = org.id;
                    this.stateOrg.send({ id: org.id });
                },
            }),
            // 获取子机构及用户列表
            stateOrg: this.$ex.request({
                action: vars => this.$axios.get('admin/vOrg/getSubOrgAndUser', { params: { id: vars.id, rootCode: this.pickerOptions.topLevel || '-1', orgType: '' } }),
                variable: {
                    id: '',
                },
                initData: {
                    orgList: [],
                    userList: [],
                },
                skip: true,
            }),
            // 搜索
            stateSearch: this.$ex.request({
                action: vars => this.$axios.get('admin/vOrg/search', { params: {
                    ...vars,
                    rootCode: this.pickerOptions.topLevel || '-1',
                    orgType: '',
                } }),
                variable: { name: '' },
                initData: {
                    userList: [],
                    orgList: [],
                },
                extra: {},
                skip: true,
            }),
            // 添加子机构
            stateMutateOrg: this.$ex.request({
                action: (vars, { extra }) => {
                    if (extra.type === 'add') {
                        return this.$axios.post('admin/tbOrg', vars);
                    }
                    return this.$axios.post('admin/tbOrg/update', vars);
                },
                variable: {
                    parentId: '',header:''
                },
                initData: {},
                onSuccess: state => {
                    state.extra.layer.show = false;
                    this.stateTree.send();
                },
                extra: {
                    type: 'add',
                    layer: {
                        show: false,
                        title: '添加子机构',
                    },
                },
                skip: true,
            }),
            // 删除机构
            stateDeleteOrg: this.$ex.request({
                action: vars => {
                    return this.$axios.get('admin/tbOrg/delete', { params: { id: vars.id } });
                },
                variable: {
                    id: '',
                },
                initData: {},
                onSuccess: state => {
                    this.stateTree.send();
                    this.stateMutateOrg.extra.layer.show = false;
                },
                skip: true,
            }),
            // 获取机构成员
            stateOrgMember: this.$ex.request({
                action: vars => {
                    return this.$axios.post('admin/tbUser/all', vars);
                },
                variable: {
                    orgId: '',
                },
                initData: {},
                skip: true,
            }),
            // 获取所有用户
            stateAllUser: this.$ex.request({
                action: vars => {
                    return this.$axios.post('admin/tbUser/all', vars);
                },
                variable: {
                },
                initData: {},
                skip: false,
            }),
            stateMutateUser: this.$ex.request({
                action: (vars, { extra }) => {
                    console.log(extra.type);
                    if (extra.type === 'add') {
                        return this.$axios.post('admin/tbUser/insertUserRole', vars);
                    }
                    return this.$axios.post('admin/tbUser/updateUserRole', vars);
                },
                variable: {
                    orgId: '',
                },
                initData: {},
                onSuccess: state => {
                    state.extra.layer.show = false;
                    this.stateOrg.send();
                },
                extra: {
                    type: 'add',
                    layer: {
                        show: false,
                        title: '添加子机构',
                    },
                },
                skip: true,
            }),
            stateDeleteUser: this.$ex.request({
                action: (vars, { extra }) => {
                    return this.$axios.get('admin/tbUser/delete', { params: { id: vars.id } });
                },
                variable: {
                    id: '',
                },
                initData: {},
                onSuccess: state => {
                    this.stateOrg.send();
                },
                extra: {
                    type: 'add',
                    layer: {
                        show: false,
                        title: '添加子机构',
                    },
                },
                skip: true,
            }),
            //获取所有角色
            stateMutateRoles: this.$ex.request({
                action: (vars, {}) => {
                    return this.$axios.post('admin/tbRole/all', vars);
                },
                variable: {},
                initData: {},
                onSuccess: state => {
                    this.rolesOptions = state.data;
                },
                skip: false,
            }),
            box: '',
            dataCurrentOrgId: '',
            rolesOptions: [],
            header: ''
        };
    },
    watch: {
        'stateSearch.variables.name'(val) {
            if (val) {
                this.stateSearch.loading = true;
                this.handleSearchDebounce();
            } else {
                this.stateSearch.loading = false;
            }
        },
        'stateOrgSort.loading'(val) {
            if (val) {
                this.sortable.orgLoadingInstance = this.$loading({
                    fullscreen: true,
                    lock: true,
                    text: '提交中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                });
            } else {
                if (this.sortable.orgLoadingInstance) {
                    this.sortable.orgLoadingInstance.close();
                }
            }
        },
        'stateUserSort.loading'(val) {
            if (val) {
                this.sortable.userLoadingInstance = this.$loading({
                    fullscreen: true,
                    lock: true,
                    text: '提交中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                });
            } else {
                if (this.sortable.userLoadingInstance) {
                    this.sortable.userLoadingInstance.close();
                }
            }
        },
        'stateOrg.loading'(val) {
            if (val) {
                this.handleSortCancel('org');
                this.handleSortCancel('user');
            }
        },
    },
    computed: {
        computedHeader: {
            get() {
                return this.stateMutateOrg.variables.header ? this.stateMutateOrg.variables.header.split(',') : [];
            },
            set(value = '') {
                this.$set(this.stateMutateOrg.variables, 'header', value.join(','));
            }
        },
        computedValueIds() {
            return this.value.map(val => val.id);
        },
        computedSidebarLoading() {
            return (!this.stateSearch.variables.name && this.stateTree.loading) || (this.stateSearch.variables.name && this.stateSearch.loading);
        },
        computedTreeFlaten() {
            const treeFlaten = {};
            if (this.stateTree.data) {
                this.handleGetTreeOrg(this.stateTree.data, treeFlaten);
            }

            return treeFlaten;
        },
        computedBreadcrumb() {
            const currentOrg = this.computedTreeFlaten[this.dataCurrentOrgId] || {};
            const stack = this.handleGetBreadcrumb(currentOrg);

            // if (stack.length <= 1) {
            //     return [];
            // }

            return stack.reverse();
        },
        computedCurrentOrg() {
            return this.computedTreeFlaten[this.dataCurrentOrgId] || {};
        },
    },
    methods: {
        handleCouldSelectOrg(org) {
            if (!this.pickerOptions.orgType || org.orgType === this.pickerOptions.orgType) {
                return true;
            }
            return false;
        },
        handleGetOrgType(org) {
            return ({
                '0': '单位',
                '1': '部门',
                '2': '班组',
            })[org.orgType];
        },
        handleSortCancel(type) {
            if (type === 'org' && this.sortable.orgDragEnable) {
                this.stateOrg.data.orgList = this.sortable.orgOriginData;
                this.sortable = {
                    orgDragEnable: false,
                    orgDrag: false,
                    orgOriginData: [],
                };
            } else if (type === 'user' && this.sortable.userDragEnable) {
                this.stateOrg.data.userList = this.sortableuserOriginData;
                this.sortable = {
                    userDragEnable: false,
                    userDrag: false,
                    userOriginData: [],
                };
            }
        },
        handleSortSubmit(type) {
            if (type === 'org') {
                const sortList = this.stateOrg.data.orgList.map((org, index) => ({ id: org.id, sort: index }));
                this.stateOrgSort.send({ data: sortList });
            } else if (type === 'user') {
                const sortList = this.stateOrg.data.userList.map((user, index) => ({ id: user.id, sort: index }));
                this.stateUserSort.send({ data: sortList });
            }
        },
        handleSortStart(type) {
            if (type === 'org') {
                this.sortable = {
                    orgDragEnable: true,
                    orgDrag: false,
                    orgOriginData: this._.cloneDeep(this.stateOrg.data.orgList),
                };
            } else if (type === 'user') {
                this.sortable = {
                    userDragEnable: true,
                    userDrag: false,
                    userOriginData: this._.cloneDeep(this.stateOrg.data.userList),
                };
            }
        },
        handleSearchClick(item, type) {
            if (this.sortable.orgDragEnable && type === 'org') {
                return;
            }
            if (this.sortable.userDragEnable && type === 'user') {
                return;
            }

            if (!this.isPicker) {
                return this.handleOrgCLick(item, type);
            }

            if (!this.handleCouldSelectOrg(item)) {
                return;
            }

            let value;
            if (this.handleValueIncludedWithId(item.id)) {
                value = this.pickerOptions.multiple ? this.value.filter(val => val.id !== item.id) : [];
            } else {
                const allName = type === 'org' ? item.allName : `${item.allOrgName}/${item.name}`;
                const newItem = { name: item.name, id: item.id, allName };
                value = this.pickerOptions.multiple ? [...this.value, newItem] : [newItem];
            }
            this.$emit('input', value);
        },
        handleOrgCLick(item, type) {
            if (type === 'org') {
                // return this.handleEditOrg(item);
                return this.handleNodeClick(item);
            } else {
                return this.handleEditUser(item);
            }
        },
        handleValueIncludedWithId(id) {
            return this.computedValueIds.includes(id);
        },
        handleSearchDebounce: _.debounce(function() {
            this.stateSearch.data.orgList = [];
            this.stateSearch.data.userList = [];
            this.stateSearch.send();
        }, 500),
        handleRemoveTag(tag) {
            const value = this.value.filter(val => val.id !== tag.id);
            this.$emit('input', value);
        },
        handleGetTreeOrg(trees = [], flaten = {}) {
            trees.forEach(tree => {
                flaten[tree.id] = tree;

                this.handleGetTreeOrg(tree.children, flaten);
            });
        },
        handleGetBreadcrumb(data, stack = []) {
            if (data.id) {
                stack.push(data);

                    if (data.parentId && this.computedTreeFlaten[data.parentId]) {
                        return this.handleGetBreadcrumb(this.computedTreeFlaten[data.parentId], stack);
                    }
                }

            return stack;
        },
        handleNodeClick(data) {
            const id = data.id;
            this.dataCurrentOrgId = id;
            this.header = data.header;
            this.stateOrg.send({ id });

            if (this.$refs.refTree && this.$refs.refTree.setCurrentKey) {
                this.$refs.refTree.setCurrentKey(id);
            }
        },
        handleAddOrg() {
            this.stateMutateOrg.variables = {
                parentId: this.computedCurrentOrg.id,
            };
            this.stateMutateOrg.extra.type = 'add';
            this.stateMutateOrg.extra.layer.title = '添加机构';
            this.stateMutateOrg.extra.layer.show = true;
        },
        handleEditOrg(org) {
            this.stateOrgMember.variables.orgId = org.id;
            this.stateOrgMember.send();
            if (!this.$auth.check('org:edit')) {
                return;
            }
            this.stateMutateOrg.variables = {
                id: org.id,
                parentId: org.parentId,
                name: org.name,
                orgType: org.orgType,
                leader: org.leader,
                header: org.header
            };
            this.stateMutateOrg.extra.type = 'edit';
            this.stateMutateOrg.extra.layer.title = '编辑机构';
            this.stateMutateOrg.extra.layer.show = true;
        },
        async handleSubmitOrg() {
            try {
                await this.$refs.refMutateOrg.validate();
                this.stateMutateOrg.send();
            } catch (e) {}
        },
        handleDeleteOrg(orgId) {
            this.stateDeleteOrg.variables = {
                id: orgId,
            };
            try {
                this.stateDeleteOrg.send();
            } catch (e) {}
        },
        async getRolesOptions() {
            try {
                this.stateMutateRoles.send();
            } catch (error) {}
        },
        handleAddUser() {
            this.stateMutateUser.variables = {
                orgId: this.computedCurrentOrg.id,
            };
            this.stateMutateUser.extra.type = 'add';
            this.stateMutateUser.extra.layer.title = '添加人员';
            this.stateMutateUser.extra.layer.show = true;
        },
        async handleSubmitUser() {
            try {
                await this.$refs.refMutateUser.validate();
                this.stateMutateUser.send();
            } catch (e) {}
        },
        async handleGetUserRoles(user) {
            this.stateMutateUserRoles.variables = {
                userId: user.id
            }
            await this.stateMutateUserRoles.send();
        },
         async handleEditUser(user) {
            if (!this.$auth.check('user:edit')) {
                return;
            }
            await this.handleGetUserRoles(user);

            this.stateMutateUser.variables = {
                id: user.id,
                userName: user.userName,
                name: user.name,
                orgId: user.orgId,
                rolePlusList: this.userRoles.map(userRoles => ({...userRoles, id: userRoles.roleId})),
            };
            this.stateMutateUser.extra.type = 'edit';
            this.stateMutateUser.extra.layer.title = '编辑人员';
            this.stateMutateUser.extra.layer.show = true;
        },
        async handleDeleteUser(userId) {
            if (confirm('确定要删除吗') == true) {
                this.stateDeleteUser.variables = {
                    id: userId,
                };
                try {
                    this.stateDeleteUser.send();
                } catch (e) {}
            }
        },
        isHeader(userId) {
            if(this.header!= undefined && this.header.indexOf(userId)!= -1) {
                return true;
            }else {
                return false;
            }
        }
    },
};
</script>

<style lang="less" scoped>
.org-index {
    &__checkbox {
        /deep/ .el-checkbox__label {
            display: none;
        }
    }

    &__tree {
        /deep/ .el-tree-node.is-current > .el-tree-node__content {
            background-color: #f5f7fa;
        }
    }
}

.flip-list-move {
    transition: transform 0.5s;
}
.no-move {
    transition: transform 0s;
}
</style>
