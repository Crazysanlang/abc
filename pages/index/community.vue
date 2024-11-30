<template>
	<view class="container">
		<CommonHeader @success="handleSuccess" />
		<view v-if="isSHequ">
			<view class="banner">
				<image src="/static/community.png" mode=""></image>
			</view>
			<view class="yssq">{{ $t('already_community') }}</view>
		</view>
		<view v-else>
			<view class="intro">{{ $t('abt_is_a') }}</view>
			<view class="bg">
				<image src="/static/bg.png" mode=""></image>
			</view>
			<view class="btn">{{ $t('upgrade_community') }}</view>
		</view>
	</view>
</template>

<script>
	import CommonHeader from './commonHeader.vue'
	import { isSHequ } from '../../utils/dapp.js'
	export default {
		components:{CommonHeader},
		data() {
			return {
				isSHequ: false
			}
		},
		async mounted() {
			this.isSHequ = await isSHequ()
		},
		methods:{
			toDetail(){
				uni.navigateTo({
					url: '/pages/index/communityDetail'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.bannerHeader {
	width: 100%;
	position: relative;
	.headerBox{
		width: 100%;
		height: 108rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}
	image {
		width: 100%;
		height: 100%;
	}
}
.yssq {
	font-weight: 600;
	font-size: 28rpx;
	color: #FFFFFF;
	text-align: center;
	margin-top: 40rpx;
}

.bg {
	height: 500rpx;

	image {
		width: 100%;
		height: 100%;
	}
}
	.btn{
		margin-top: 40rpx;
	}
	.banner{
		height: 750rpx;
		margin-top: 88rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.intro{
		margin-top: 90rpx;
		font-size: 28rpx;
		color: rgba(255, 255, 255,.8);
		padding: 30rpx;
		line-height: 60rpx;
	}
	.arrow {
		width: 28rpx;
		height: 28rpx;
		display: inline-block;
		vertical-align: sub;
	}
</style>