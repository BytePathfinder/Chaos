<template>
	<view>
		<view class="title">{{text}}</view>
		<view class="content">
			<rich-text :nodes="con"></rich-text>
		</view>
	</view>
</template>

<script>
	import { cheerio } from './cheerio.js'
	export default {
		data() {
			return {
				text:'',
				con:'',
				data:[]
			}
		},
		onLoad(){
			this.getHtml()
			
		},
		methods: {
			getHtml(){
				// const $ = cheerio.load('<h2 class="title">Hello world</h2>');
				// $('h2.title').text('Hello there!');
				// $('h2').addClass('welcome');
				// this.text = $.html();
				
				let that = this
				uni.request({
					url:'https://www.xiaoxues.com/yuwen/1910.html',
					success(res) {
						//console.log(res,2222)
						//1、_useHtmlParser2：解决parse创建dom报错
						//2、decodeEntities：解决html方法被编码问题
						const $ = cheerio.load(res.data, { _useHtmlParser2: true,decodeEntities: false })
						
						const title = $('.title');
						that.text = title[0].children[0].data
						
						const content = $('.content');
						//console.log(content.html(),111)
						that.con = content.html()
					}
				})
			}
		}
	}
</script>

<style>
.title{
	padding: 30rpx ;
}
.content{
	padding: 30rpx;
}
</style>
