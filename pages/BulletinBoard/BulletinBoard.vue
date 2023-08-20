<template>
	<view class="container">
		<!-- 富文本编辑器 -->
		<web-view :src="webUrl" @message="acceptMessageFromH5"></web-view>
	</view>
</template>

<script>
	var wv; //计划创建的webview
	export default {
		data() {
			return {
				webUrl: "/hybrid/html/editor.html?date=" + new Date(),
				statusBarHeight: 0,
				navBarHeight: 0,
			}
		},
		methods: {
			// 监听页面发送的消息
			sendMessageToH5() {
				let data = [{
					"statusBarHeight": this.statusBarHeight,
					"navBarHeight": this.navBarHeight,
				}]
				let currentWebview = this.$scope.$getAppWebview(); //获取当前web-view
				wv = currentWebview.children()[0];
				// params 传递的参数
				let params = JSON.stringify(data)
				// wv.evalJS调用H5方法并传递数据
				wv.evalJS("getUniAppMessage(" + params + ")") //getUniAppMessage h5中获取数据的方法
			},
			acceptMessageFromH5(e) {
				// 传递数据在 e.detail.data
				let msgData = e.detail.data;
				// 以下可判断传来数据，并做处理
				switch (msgData[0].action) {
					case "postMessage":
						console.log(JSON.stringify(msgData))
						this.sendMessageToH5()
						break;
				}
			},
			// rpx转px
			rpxToPx(rpx) {
				const screenWidth = uni.getSystemInfoSync().screenWidth
				return (screenWidth * Number.parseInt(rpx)) / 750
			},
			// px转rpx
			pxToRpx(px) {
				const screenWidth = uni.getSystemInfoSync().screenWidth
				return (750 * Number.parseInt(px)) / screenWidth
			}

		},
		// 创建hook
		created() {
			// 维护状态栏
			this.statusBarHeight = uni.getSystemInfoSync()["statusBarHeight"];
			console.log('状态栏高度: ' + this.statusBarHeight + "px");
			this.navBarHeight = this.rpxToPx(80);
			console.log('顶部导航栏高度: ' + this.navBarHeight + "px");
		},
		mounted() {
			console.log("即将跳转webview：", this.webUrl);
		}
	}
</script>

<style>

</style>