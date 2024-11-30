<template>
	<view class="container">
		<view class="banner">
			<div class="headerBox">
				<CommonHeader @success="handleSuccess" />
			</div>
			<image src="/static/team.png" mode=""></image>
		</view>
		<view class="flexBox" style="margin-top: -40rpx;">
			<view class="box">
				<view class="boxTxt">{{ $t('recommend_number') }}</view>
				<view class="boxNum">{{ format(pageOb.tui_jian_ren_shu)   }}</view>
			</view>
			<view class="box">
				<view class="boxTxt">{{ $t('team_level') }}</view>
				<view class="boxNum">{{ format(pageOb.tuan_dui_ji_bie)   }} </view>
			</view>
		</view>
		<view class="flexBox" style="margin-top: 14px;">
			<view class="box">
				<view class="boxTxt">{{ $t('team_number') }}</view>
				<view class="boxNum">{{ format(pageOb.tui_jian_ren_shu)   }}</view>
			</view>
			<view class="box">
				<view class="boxTxt">{{ $t('team_yield') }}</view>
				<view class="boxNum">{{ format(pageOb.tuan_dui_ye_ji)   }} </view>
			</view>
		</view>
		<view class="yqlj">{{ $t('invite_link') }}</view>
		<view class="invite">
			<view class="link">{{ linkAdress }}</view>
			<view class="copy" @click="handleCopy">
				<image src="/static/copy.png" mode=""></image>
			</view>
		</view>
		<view class="tdjx">{{ $t('team_performance') }}</view>
		<view class="teamList">
			<view class="tHeader">
				<view class="">{{ $t('address') }}</view>
				<view class="">{{ $t('recommend_number') }}</view>
				<view class="">{{ $t('team_number') }}</view>
				<view class="">{{ $t('performance') }}</view>
			</view>
			<view class="tBody">
				<view class="list" v-for="(item,index) in list" :key="index">
					<view class="">{{ formatString(item.addr) }}</view>
					<view class="">{{ item.tui_jian_ren_shu || '-' }}</view>
					<view class="">{{ item.tuan_dui_ren_shu || '-' }}</view>
					<view class="">{{ item.tuan_dui_ye_ji || '-' }}</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
import CommonHeader from './commonHeader.vue'

export default {
	components: { CommonHeader },

	data() {
		return {
			linkAdress: '',
			pageOb:{},
			list:[]
		}
	},
	mounted() {
		this.getList()
		this.renderlink()
	},

	methods: {
		formatString(str) {
		if (!str) return "-";
		let str1 = str.substring(0, 4);
		let str2 = str.substring(str.length - 4, str.length);
		return str1 + "****" + str2;
		},
		format(value){
			if(value == 'undefined' || value == null || value == ''){
				return 0;
			}else {
				return value;
			}
		},
		handleSuccess() {
			this.getList()
			this.renderlink()
		},
		renderlink(){
			const address = getApp().globalData.address
			if(!address){
				return uni.showToast({ title: this.$t('please_link_wallet') })
			}
			const url = window.location.origin
			this.linkAdress = url + '/?invite=' + address
		},
		getList(){
			const address = getApp().globalData.address
			if(!address){
				return uni.showToast({ title: this.$t('please_link_wallet') })
			}
			uni.request({
				url: 'https://abczone.org/api/info', 
				method: 'GET',
				data: {
					address
				},
				header: {
					'content-type': 'application/json'
				},
				success: (res) => {
					console.log("🚀 ~ getList ~ res:", res)
					this.list = res.data.data.tables
					this.pageOb = res.data.data
				}
			});	

		},
		handleCopy() {
			const _this = this;
			uni.setClipboardData({
				data: _this.linkAdress,
				success: function () {
					uni.showToast({
						title: _this.$t('success'),
					});
				}
			});
		},
	}
}
</script>

<style scoped lang="scss">
.container{
	width: 100vw;
	overflow-x: hidden;
}
.teamList {
	margin: 20rpx 40rpx;
}

.tHeader {
	display: flex;
	align-items: center;
	justify-content: space-between;

	view {
		flex: 1;
		font-weight: 400;
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.5);
		text-align: center;
	}

	view:first-child {
		text-align: left;
	}
}

.list {
	display: flex;
	align-items: center;
	justify-content: space-between;

	view {
		flex: 1;
		font-weight: 400;
		font-size: 24rpx;
		color: #FFFFFF;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}

	view:first-child {
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}

.tdjx {
	// font-weight: 600;
	font-size: 32rpx;
	color: #FFFFFF;
	padding-left: 40rpx;
	margin-top: 40rpx;
}

.invite {
	margin:0 40rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 40rpx;
	height: 80rpx;
	margin-top: 20rpx;
	background: rgba(255,255,255,0.08);
	border-radius: 10rpx;
	backdrop-filter: blur(10px);

	.link {
		font-weight: 400;
		font-size: 24rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: rgba(255,255,255,0.75);
		width: 80%;
		word-break: break-all;
	}

	.copy {
		width: 58rpx;
		height: 58rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}
}

.yqlj {
	padding-left: 40rpx;
	// font-weight: 600;
	font-size: 32rpx;
	color: #FFFFFF;
	margin-top: 46rpx;
}

.flexBox {
	// margin-bottom: 40rpx;
	margin: 0 30rpx;

	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 14rpx;
	.box {
		display: flex;
		align-content: center;
		justify-content: center;
		flex-wrap: wrap;
		box-sizing: border-box;
		text-align: center;
		width: 338rpx;
		height: 160rpx;
	// margin: 0 14rpx;

		background: rgba(255,255,255,0.08);
		border-radius: 20rpx;
		backdrop-filter: blur(10px);

		.boxTxt {
			width: 100%;
			font-weight: 400;
			font-size: 22rpx;
			color: #FFFFFF;
			margin-bottom: 8rpx;
		}

		.boxNum {
			width: 100%;
			font-weight: 600;
			color: #008EFF;
			font-size: 42rpx;
			text {
				font-size: 24rpx;
			}
		}
	}
}

.banner {
	width: 100%;
	height: 480rpx;
	position: relative;
	.headerBox{
		width: 100%;
		height: 108rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
	}
	image {
		width: 100%;
		height: 100%;
	}
}

.arrow {
	width: 28rpx;
	height: 28rpx;
	display: inline-block;
	vertical-align: sub;
}

.top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 30rpx;
	height: 108rpx;

	.title {
		font-size: 24rpx;
		color: #C6FE3E;
		white-space: nowrap;
		display: flex;
		align-items: center;
		justify-content: center;

		.logo {
			width: 64rpx;
			height: 64rpx;
			vertical-align: text-bottom;
			margin-right: 38rpx;

			text {
				// vertical-align: middle;
				// font-weight: 600;
				font-size: 24rpx;
				color: #C6FE3E;
			}
		}
	}

	.tr {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.link {
		display: flex;
		justify-content: center;
		align-items: center;

		text {
			font-weight: 400;
			font-size: 24rpx;
			color: #C6FE3E;
			padding-left: 4rpx;
		}
	}

	.wallet {
		width: 48rpx;
		height: 48rpx;
		display: inline-block;
	}

	.language {
		height: 70rpx;
		line-height: 70rpx;
		// width: 200rpx;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;

		::v-deep .uni-stat__select {
			// opacity: 0;
			// width: 200rpx;
			height: 70rpx;
			position: absolute;
			top: 0;
			left: 0;
			border: 1px solid #FFFFFF;
		}

		::v-deep .uni-select {
			width: 100rpx;
			border: none;
			// background-color: #040404;
		}

		::v-deep .uni-select__selector {
			border: none;
			background: #1A1A1A;
			border-radius: 5px;
		}

		::v-deep .uni-select__input-placeholder {
			opacity: 0;
		}

		::v-deep .uni-select__input-text {
			opacity: 0;
		}

		image {
			height: 48rpx;
			width: 48rpx;
			// vertical-align: middle;
		}

		text {
			// vertical-align: middle;
		}

		font-weight: 400;
		font-size: 24rpx;
		color: #FFFFFF;
	}
}
</style>