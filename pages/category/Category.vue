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
				<input class="search-input" @confirm="search" confirm-type="search" v-model="searchKeyWords" />
				<button class="search-btn" type="default" @click="search">搜索</button>
			</view>
		</view>
		<!-- 正文 文档流-->
		<!-- 占位 状态栏 -->
		<view class="status-bar" :style="{paddingTop: statusBarHeight + 'px'}"></view>
		<!-- 占位 顶部导航栏 -->
		<view style="height:110rpx;"></view>
		<view class="content">
			<!-- 正文 -->
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
			}
		},
		methods: {
			search() {
				console.log("search:" + this.searchKeyWords);
			},
			tapSearchBox() {
				clearInterval(this.intervalId);
				this.intervalId = null;
			},
			resetCycle() {
				let products = ["蔬菜", "肉类", "菌类", "蛋奶", "食品", "电器", "日用百货"];
				let pointer = 0;
				this.intervalId = setInterval(() => {
					this.searchKeyWords = products[pointer];
					pointer++;
					if (pointer == products.length) {
						pointer = 0;
					}
				}, 1000);
			}
		},
		created() {
			this.statusBarHeight = uni.getSystemInfoSync()["statusBarHeight"];
			console.log('状态栏高度: ' + this.statusBarHeight + "px");
		},
		onShow() {
			this.resetCycle();
		},
		onHide() {
			clearInterval(this.intervalId);
			this.intervalId = null;
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
			z-index: 10000;
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
		}
	}
</style>