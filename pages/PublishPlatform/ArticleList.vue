<template>
	<view class="container">
		<!-- 富文本编辑器 -->
		<web-view :src="webUrl" @message="acceptMessageFromH5"></web-view>
	</view>
</template>

<script>
	var wv; //计划创建的webview
	import qiniuUpload from "../../utils/upload.js"
	export default {
		data() {
			return {
				webUrl: "/hybrid/html/editor/android.html",
				statusBarHeight: 0,
				navBarHeight: 0,
			}
		},
		methods: {
			acceptMessageFromH5(e) {
				// 传递数据在 e.detail.data
				let msgData = e.detail.data;
				// 以下可判断传来数据，并做处理
				switch (msgData[0].action) {
					case "statusBarAndNavBarHeight":
						console.log(JSON.stringify(msgData))
						this.sendStatusBarAndNavBarHeightInfo()
						break;
					case "chooseImage":
						console.log(JSON.stringify(msgData))
						this.chooseImage()
						break;
				}
			},
			// 监听页面发送的消息
			sendStatusBarAndNavBarHeightInfo() {
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
			// 选择图片
			chooseImage() {
				let self = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function(imageResource) {
						console.log(JSON.stringify(imageResource.tempFilePaths));
						// 上传到七牛云
						qiniuUpload(imageResource, (imageUrl) => {
							let data = [{
								imageUrl
							}]
							let currentWebview = self.$scope.$getAppWebview(); //获取当前web-view
							wv = currentWebview.children()[0];
							// params 传递的参数
							let params = JSON.stringify(data)
							// wv.evalJS调用H5方法并传递数据
							wv.evalJS("chooseImageNotice(" + params +
								")") //getUniAppMessage h5中获取数据的方法
						})
					}
				});
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
			// 判断操作系统（ios、android）
			let platform = uni.getSystemInfoSync().platform;
			console.log("平台：", JSON.stringify(uni.getSystemInfoSync()))
			if (platform === "ios") {
				// ios
				this.webUrl = "/hybrid/html/editor/ios.html";
			} else if (platform === "android") {
				// android
				this.webUrl = "/hybrid/html/editor/android.html";
			} else {
				// h5
				this.webUrl = "/hybrid/html/editor/ios.html";
			}

		},
		mounted() {
			console.log("即将跳转webview：", this.webUrl);
		}
	}
</script>

<style>

</style>