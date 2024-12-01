<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			address: ''
		},  
	}
</script>

<style>
	/*每个页面公共css */
	page{
		background: #040404;
		font-family:PingFangSC, DINPro,Arial, Helvetica, sans-serif;
	}
	.btn{
		margin: 0 50rpx;
		height: 88rpx;
		border-radius: 10rpx;
		font-weight: 600;
		font-size: 28rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 88rpx;
		height: 88rpx;
		background: linear-gradient( 270deg, #000AFF 0%, #00BCFF 100%);
		border-radius: 10rpx;
	}
</style>
