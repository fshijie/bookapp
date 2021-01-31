<template>
    <div ref="canvasContainer">
        <div class="ut-flex ut-justify-between ut-items-center ut-pb-1">
            <div class="ut-text-sm">{{ title }}</div>
            <el-button size="mini" @click="clear">清除</el-button>
        </div>
        <canvas
            ref="canvas"
            class="ut-border ut-max-w-full ut-mx-auto ut-block"
            @mousedown.prevent="mousedown"
            @mousemove.prevent="mousemove"
            @mouseup.prevent="mouseup"
            @touchstart.prevent="touchstart"
            @touchmove.prevent="touchmove"
            @touchend.prevent="touchend"
        ></canvas>
    </div>
</template>

<script>
export default {
    name: 'HandleWrite',
    props: ['title'],
    data() {
        return {
            ctx: null,
            hasContent: false,
            isDrawStart: false
        };
    },
    methods: {
        mousedown(e) {
            this.isDrawStart = true;
            this.onDrawStart(e.clientX, e.clientY);
        },
        mousemove(e) {
            if (!this.isDrawStart) {
                return;
            }
            this.onDrawMove(e.clientX, e.clientY);
        },
        mouseup(e) {
            this.isDrawStart = false;
            this.onDrawEnd();
        },
        touchstart(e) {
            this.onDrawStart(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        },
        touchmove(e) {
            this.onDrawMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        },
        touchend(e) {
            this.onDrawEnd();
        },
        onDrawStart(clientX, clientY) {
            const canvas = this.$refs.canvas;
            const { left, top, width, height } = canvas.getBoundingClientRect();

            // 计算画布被缩放后的比例
            const ratioX = canvas.width / width;
            const ratioY = canvas.height / height;
            const transClientX = (clientX - left) * ratioX;
            const transClientY = (clientY - top) * ratioY;

            this.ctx.beginPath();
            this.ctx.moveTo(transClientX + 0.5, transClientY + 0.5);
        },
        onDrawMove(clientX, clientY) {
            const canvas = this.$refs.canvas;
            const { left, top, width, height } = canvas.getBoundingClientRect();

            // 计算画布被缩放后的比例
            const ratioX = canvas.width / width;
            const ratioY = canvas.height / height;
            const transClientX = (clientX - left) * ratioX;
            const transClientY = (clientY - top) * ratioY;

            this.ctx.lineTo(transClientX + 0.5, transClientY + 0.5);
            this.ctx.stroke();
            this.hasContent = true;
        },
        onDrawEnd() {
            this.ctx.closePath();
        },
        clear() {
            const canvas = this.$refs.canvas;
            this.ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.hasContent = false;
        },
        emitGetDataURL() {
            const imgBase64 = this.$refs.canvas.toDataURL();
            return imgBase64;
        },
        emitHasContent() {
            return this.hasContent;
        }
    },
    mounted() {
        const canvas = this.$refs.canvas;
        const width = this.$refs.canvasContainer.clientWidth;
        canvas.width = width;
        canvas.height = width;
        this.ctx = canvas.getContext('2d');
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.ctx.lineCap = 'round';
    }
};
</script>

<style></style>
