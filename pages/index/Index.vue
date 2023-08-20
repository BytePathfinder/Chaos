<template>
	<view class="container">
		<!-- 固定定位 脱离文档流 -->
		<view class="header">
			<!-- 状态栏占位 -->
			<view class="status-bar" :style="{paddingTop: statusBarHeight + 'px'}"></view>
			<!-- 顶部导航栏 -->
			<view class="nav-bar" @click="tapSearchBox">
				<view class="search-prefix-icon">
					<icon type="search" />
				</view>
				<input class="search-input" @confirm="search" confirm-type="search" v-model="searchKeyWords"
					placeholder="白菜" />
				<button class="search-btn" type="default" @click="search">搜索</button>
			</view>
		</view>
		<!-- 正文 文档流中-->
		<!-- 占位 状态栏 -->
		<view class="status-bar" :style="{paddingTop: statusBarHeight + 'px'}"></view>
		<!-- 占位 顶部导航栏 -->
		<view style="height:110rpx;"></view>
		<!-- 正文 -->
		<view class="content">
			<!-- 正文轮播图 -->
			<u-swiper :list="swiperList" keyName="image" indicator indicatorMode="dot" previousMargin="30"
				nextMargin="30" redius='50' height="170" interval="3000" circular @change="swiperChange"
				@click="swiperClick" :loading="loading">
			</u-swiper>
			<!-- 横向滚动列表 -->
			<u-scroll-list @right="scrollRight" @left="scrollLeft" :indicator="scrollIndicator" indicatorColor="#fff0f0"
				indicatorActiveColor="#f56c6c">
				<view class="scroll-list">
					<view class="scroll-list__line" v-for="(item, index) in scrollList" :key="index">
						<view class="scroll-list__line__item" v-for="(item1, index1) in item" :key="index1"
							@click="scrollItemClick(item1.url)"
							:class="[(index1 === item.length - 1) && 'scroll-list__line__item--no-margin-right']">
							<image class="scroll-list__line__item__image" :src="item1.thumb" mode="">
							</image>
							<view class="scroll-list__line__item__text">{{ item1.title }}</view>
						</view>
					</view>
				</view>
			</u-scroll-list>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				searchKeyWords: "",
				intervalId: null,
				swiperList: [],
				loading: true,
				scrollList: [],
				scrollIndicator: true
			}
		},
		methods: {
			// 搜索回调
			search() {
				console.log("search:" + this.searchKeyWords);
				let key = 'https://admin.秋叶为民.com/admin/captcha.jpg'
				uni.$get(key)
					.then(response => {
						console.log(response);
					})
					.catch(reason => {
						console.log(reason);
					})
			},
			// 点击搜索框时停止引导词循环
			tapSearchBox() {
				clearInterval(this.intervalId);
				this.intervalId = null;
			},
			// 重置搜索框循环
			resetCycle() {
				let products = ["白菜", "萝卜", "洋葱", "西红柿"];
				let pointer = 0;
				this.intervalId = setInterval(() => {
					this.searchKeyWords = products[pointer];
					pointer++;
					if (pointer == products.length) {
						pointer = 0;
					}
				}, 1000);
			},
			// 请求轮播图
			getSwiperList() {
				console.log("请求轮播图");
				uni.$get("https://front.xn--siqq3l8wxsrm.com/api/customer/ad/get")
					.then(response => {
						for (let item of response.data) {
							this.swiperList.push({
								image: item["mediaPath"],
								title: item["adName"]
							})
						}
						this.loading = false;
						console.log("请求轮播图成功，列表：", JSON.stringify(this.swiperList));
					})
					.catch(reason => {
						console.log("请求轮播图失败：", reason);
					})
			},
			// 轮播图改变回调
			swiperChange() {
				// console.log("轮播图改变");
			},
			// 轮播图点击回调
			swiperClick(index) {
				console.log("轮播图被点击:" + index);
			},
			// 请求横向滚动列表
			requestScrollList() {
				console.log("请求横向滚动列表");
				uni.$get("https://front.xn--siqq3l8wxsrm.com/api/customer/column/get")
					.then(response => {
						let tempScrollList = [];
						for (let item of response.data) {
							tempScrollList.push({
								id: item['id'],
								title: item['columnName'],
								thumb: item['columnImg'],
								url: item['columnUrl'],
								order: item['columnOrder'],
								enabled: item['enabled'],
								remark: item['remark']
							})
						}
						// 排序，并分成两组
						tempScrollList.sort((pre, next) => pre['order'] - next['order']);
						console.log("tempScrollList:", JSON.stringify(tempScrollList));
						let even = [];
						let odd = [];
						for (var i = 0; i < tempScrollList.length; i++) {
							if (i % 2 === 0) {
								even.push(tempScrollList[i]);
							} else {
								odd.push(tempScrollList[i]);
							}
						}
						this.scrollList.push(even);
						this.scrollList.push(odd);
						console.log("请求横向滚动列表成功，列表：", JSON.stringify(this.scrollList));
					})
					.catch(reason => {
						console.log("请求横向滚动列表失败：", reason);
					})
			},
			// 横向滚动列表 @right
			scrollRight() {
				console.log("横向滚动列表到达右边缘");
			},
			// 横向滚动列表 @left
			scrollLeft() {
				console.log("横向滚动列表到达左边缘");
			},
			// 滚动项点击回调
			scrollItemClick(path) {
				console.log("滚动项点击回调", path);
				let target = "/pages" + path;
				uni.navigateTo({
					url: target,
				})
			}
		},
		// 创建hook
		created() {
			// 维护状态栏
			this.statusBarHeight = uni.getSystemInfoSync()["statusBarHeight"];
			console.log('状态栏高度: ' + this.statusBarHeight + "px");
		},
		// 挂载hook
		mounted() {
			console.log("mounted");
			// 请求轮播图
			this.getSwiperList();
			// 请求横向滚动列表
			this.requestScrollList();
		},
		// 页面显示hook
		onShow() {
			this.resetCycle();
		},
		// 页面隐藏hook
		onHide() {
			clearInterval(this.intervalId);
			this.intervalId = null;
		},
		// 下拉刷新
		onPullDownRefresh() {
			console.log("刷新开始");
			this.loading = true;
			// 刷新轮播图
			this.getSwiperList();
			// 刷新横向滚动列表
			this.requestScrollList();
			setTimeout(() => {
				console.log("刷新完毕");
				uni.stopPullDownRefresh()
			}, 3000)
		},
		// 触底加载
		onReachBottom() {
			console.log("触底加载开始");
			setTimeout(() => {
				this.someMessage += "到底了"
				console.log("触底加载完毕");
			}, 1000)
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		margin: 0;
		padding: 0;

		.header {
			position: fixed;
			top: 0;
			left: 0;
			background-color: #fff;
			z-index: 100;
		}

		.nav-bar {
			$height: 80rpx;
			width: calc(100vw - 20rpx);
			height: $height;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			margin: 5rpx;
			padding: 5rpx;
			border: 1px solid red;
			border-radius: $height / 2;

			.search-prefix-icon {
				margin: 0 10rpx;
			}

			.search-input {
				flex: 1;
				padding: 5rpx;
			}

			.search-btn {
				$height: 70rpx;
				height: $height;
				// width: 120rpx;
				border-radius: $height/2;
				color: #fff;
				background: linear-gradient(45deg, #FF9D1A, #ff0000);
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		.content {
			width: 100vw;

			.scroll-list {
				@include flex(column);
				margin-top: 2-rpx;
				padding: 10rpx;

				&__line {
					@include flex;
					margin-top: 10rpx;

					&__item {
						margin-right: 50rpx;

						&__image {
							width: 150rpx;
							height: 150rpx;
							border-radius: 50%;
						}

						&__text {
							margin-top: 5rpx;
							color: $u-content-color;
							font-size: 16px;
							text-align: center;
						}

						&--no-margin-right {
							margin-right: 0;
						}
					}
				}
			}
		}
	}
</style>