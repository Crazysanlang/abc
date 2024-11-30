<template>
	<view class="content">
		<view class="banner">
			<div class="headerBox">
				<CommonHeader @success="handleSuccess" />
			</div>
			<image src="/static/banner.png" mode=""></image>
		</view>
		<view class="flexBox" style="margin-top: -100rpx;">
			<view class="box">
				<image src="/static/index_box1.png" mode=""></image>
				<view style="flex: 1;height: 100%;">
					<view class="boxTxt">{{ $t('personal_power') }}</view>
					<view class="boxNum">{{ suanli }}</view>
				</view>
			</view>
			<view class="box">
				<image src="/static/index_box2.png" mode=""></image>
				<view style="flex: 1;height: 100%;">
					<view class="boxTxt">{{ $t('total_received') }}</view>
					<view class="boxNum">{{ totalPaid }}</view>
				</view>
			</view>
		</view>
		<view class="tikuang">
			<image class="logo" src="/static/logo.png"></image>
			<view>{{ rewardAmount }}</view>
			<button @click="withdrawAll">{{ $t('one_key_withdraw') }}</button>
		</view>
		<view class="bgbottom">
			<view class="flexTongdao">
				<view class="tongdao">
					<view class="items-center">
						<image src="/static/abt.png" mode="scaleToFill" />
						<image src="/static/th.png" mode="scaleToFill" />
					</view>
					<view class="tdTxt">20%ABT+80%USDT</view>
					<button @click="handleStakeAbc">{{ $t('deposit_channel') }}</button>
				</view>
				<view class="tongdao">
					<view class="items-center">
						<image src="/static/th.png" mode="scaleToFill" />
					</view>
					<view class="tdTxt">100%USDT</view>
					<button @click="handleStakeUsdt">{{ $t('deposit_channel') }}</button>
				</view>
			</view>
			<view class="bannerBottom">
				<view>{{ $t('10usdt_start') }}</view>
				<view>{{ $t('24_hour_constant') }}</view>
				<!-- <image src="/static/banner_bottom.png" mode="scaleToFill" /> -->
			</view>
		</view>

		<uni-popup ref="popup1" type="center" border-radius="10px 10px 0 0">
			<view class="dialog1">
				<view class="xzqx">{{ $t('deposit_limit') }}</view>
				<view class="inputBox">
					<input v-model="stakeNum" type="number" :placeholder="placeholder" />
					<!-- <image src="/static/th.png" mode=""></image> -->
				</view>
				<button :disabled="isDisable" class="btn" @click="handleClick">{{ $t('immediately_deposit') }}</button>
			</view>
		</uni-popup>
		<uni-popup ref="popup" type="center" border-radius="10px 10px 0 0">
			<view class="dialog">
				<!-- <image src="/static/success.png" mode=""></image> -->
				<icon style="margin-top: 120rpx;" type="success" size="46"/>
				<view class="txt1">{{ $t('deposit_success') }}</view>
				<view class="txt2">{{ $t('you_deposit') }}{{ stakeNum }}USDT</view>
				<button type="button" @click="handleConfirm" class="btn">{{ $t('determine') }}</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import CommonHeader from './commonHeader.vue'
import { withdrawAllReward, get_suan_li, get_total_paid, get_reward_amount,stakeABC,stakeUSDT } from '../../utils/dapp.js'

export default {
	components: { CommonHeader },
	data() {
		return {
			isDisable: true,
			curDay: 0,
			rate: 0.8,
			limtNum: 100,
			placeholder: this.$t('input_deposit_limit'),
			stakeNum: '',
			totalStakeAmount: '',
			totalStakeInterest: '',
			suanli: 0,
			totalPaid: 0,
			rewardAmount: 0,
			isAbc:false,
			isUsdt:false,
		}
	},
	watch: {
		stakeNum: function (val) {
			this.isDisable = !(!!val)
		},
	},
	mounted() {
		this.getInviteCode();
		this.handleGetSuanLi()
		this.handleGetRewardAmount()
	},

	methods: {
		handleStakeAbc() {
			this.$refs.popup1.open()
			this.isAbc=true
			this.isUsdt=false
		},
		handleStakeUsdt() {
			this.$refs.popup1.open()
			this.isUsdt=true
			this.isAbc=false
		},
		async handleGetRewardAmount() {
			try {
				const res = await get_reward_amount()
				this.rewardAmount = res
				console.log(res)
			} catch (error) {
				console.log(error)
			}
		},
		async handleGetSuanLi() {
			try {
				const res = await get_suan_li()
				this.suanli = res
				console.log(res)
			} catch (error) {
				console.log(error)
			}
		},
		async get_total_paid() {
			try {
				const res = await get_total_paid()
				this.totalPaid = res
			} catch (error) {
				console.log(error)
			}
		},
		handleSuccess() {
			this.init()
			this.getInviteCode();
		},
		getInviteCode() {
			const url = new URL(window.location.href);
			const inviteCode = url.searchParams.get("invite");
			if (inviteCode) {
				uni.setStorageSync('invite', inviteCode)
			}
		},
		
		withdrawAll() {
			const address = getApp().globalData.address
			if (!address) {
				uni.showToast({ title: this.$t('please_link_wallet'), icon: 'error' })
				return
			}
			uni.showModal({
				title: this.$t('prompt'),
				content: this.$t('determine_withdraw'),
				confirmText: this.$t('determine1'),
				cancelText: this.$t('cancel'),
				showCancel: true,
				success: async ({ confirm, cancel }) => {
					if (confirm) {
						try {
							const res = await withdrawAllReward()
						} catch (error) {
							uni.showToast({ title: this.$t('fail'), icon: 'error' })
						}

					}
				}
			})
		},
		async handleClick() {
			if(!this.stakeNum){
				uni.showToast({ title: this.$t('please_input_deposit1'), icon: 'error' })
				return
			}
			const parentUrl = uni.getStorageSync('invite')
			let res = null
			if(this.isAbc){
				res = await stakeABC(
					this.stakeNum,
					parentUrl
				)
			}
			if(this.isUsdt){
				res = await stakeUSDT(
					this.stakeNum,
					parentUrl
				)
			}
			if(res.error){
				uni.showToast({ title: res.msg, icon: 'error',  })
			}else{
				  this.$refs.popup.open()
				  
				  const res = await get_suan_li()
				  this.suanli = res
				  
			}
		},
		handleConfirm() {
			this.$refs.popup.close()
			this.$refs.popup1.open()
		},
	}
}
</script>

<style scoped lang="scss">
.arrow {
	width: 28rpx;
	height: 28rpx;
	display: inline-block;
	vertical-align: sub;
}

.flex {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 30rpx 20rpx 50rpx;

	view:first-child {
		font-weight: 600;
		font-size: 32rpx;
		color: #FFFFFF;
	}

	view:last-child {
		font-size: 24rpx;
		color: #C6FE3E;
	}
}

.banner {
	width: 100%;
	height: 430rpx;
	background-color: #FFFFFF;
	position: relative;

	.headerBox {
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

.flexBox {
	// margin-bottom: 40rpx;
	margin: 0 40rpx;

	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16rpx;

	.box {
		display: flex;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;
		box-sizing: border-box;
		text-align: left;
		width: 338rpx;
		height: 160rpx;
		padding: 30rpx;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 20rpx;
		backdrop-filter: blur(10px);

		image {
			width: 70rpx;
			height: 70rpx;
			margin-right: 20rpx;
		}

		.boxTxt {
			width: 100%;
			font-weight: 400;
			font-size: 22rpx;
			color: rgba(255, 255, 255, 1);
			margin-bottom: 8rpx;
		}

		.boxNum {
			width: 100%;
			// font-weight: 500;
			font-size: 36rpx;
			color: #008EFF;
			text {
				font-size: 24rpx;
			}
		}
	}
}
.dialog1 {
	width: 520rpx;
	height: 420rpx;
	background: #1E1E1E;
	border-radius: 40rpx;
	text-align: center;
}
.dialog {
	width: 520rpx;
	height: 720rpx;
	background: #1E1E1E;
	border-radius: 40rpx;
	text-align: center;

	image {
		width: 100rpx;
		height: 100rpx;
		margin-top: 120rpx;
	}

	.txt1 {
		font-weight: 600;
		font-size: 36rpx;
		color: #FFFFFF;
		margin-top3: 20rpx;
	}

	.txt2 {
		font-weight: 400;
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.5);
		margin-top: 40rpx;
		margin-bottom: 238rpx;
	}

	.btn {
		margin: 0 30rpx;
	}
}

.tikuang {
	margin:16rpx 30rpx;
	height: 340rpx;
	box-sizing: border-box;
	background: rgba(255, 255, 255, 0.08);
	border-radius: 20rpx;
	backdrop-filter: blur(10px);
	padding: 30rpx;
	padding-top: 60rpx;

	text-align: center;

	.logo {
		width: 48rpx;
		height: 48rpx;
		margin: 0 auto;
	}

	view {
		color: #ffffff;
		// font-weight: 500;
		font-size: 48rpx;
		color: #FFFFFF;
	}

	button {
		margin: 0 30rpx;
		margin-top: 40rpx;
		height: 88rpx;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10rpx;
		font-weight: 600;
		font-size: 28rpx;
		line-height: 88rpx;
		color: #FFFFFF;
	}
}

.flexTongdao {
	display: flex;
	justify-content: space-between;
	align-items: center;
	// padding: 0 20rpx;
	gap: 14rpx;

	.tongdao {
		width: 318rpx;
		height: 280rpx;
		padding: 40rpx 30rpx;
		background: rgba(255, 255, 255, 0.04);
		border-radius: 20rpx;
		box-sizing: border-box;

		.tdTxt {
			margin: 16rpx 0 30rpx 0;
			text-align: center;
			// font-weight: 400;
			font-size: 24rpx;
			color: #FFFFFF;
		}

		button {
			margin: 0 auto;
			width: 258rpx;
			height: 60rpx;
			background: linear-gradient(270deg, #000AFF 0%, #00BCFF 100%);
			border-radius: 8rpx;
			font-weight: 600;
			font-size: 24rpx;
			color: #FFFFFF;
			text-align: center;
			line-height: 60rpx;
		}
	}

	.items-center {
		display: flex;
		align-items: center;
		justify-content: center;

		image {
			width: 48rpx;
			height: 48rpx;
		}
	}
}

.bgbottom {
	margin: 20rpx 30rpx;
	padding: 20rpx;
	background: rgba(255, 255, 255, 0.08);
	border-radius: 20rpx;
	backdrop-filter: blur(10px);
}

.bannerBottom {
	margin: 0 auto;
	width: 600rpx;
	height: 200rpx;
	background-image: url('../../static/banner_bottom.png');
	background-position: center center;
	background-repeat: no-repeat;
	background-size: contain;
	padding: 60rpx 0 0 32rpx;
	// font-weight: 600;
	font-size: 28rpx;
	color: #FFFFFF;

	image {
		width: 100%;
		height: 100%;
	}
}

.xzqx {
	// font-weight: 400;
	font-size: 34rpx;
	color: #ffffff;
	padding:40rpx 50rpx;
}

.inputBox {
	margin: 0 50rpx;
	margin-top: 20rpx;
	margin-bottom: 50rpx;
	border-radius: 10rpx;
	border: 1rpx solid #FFFFFF;
	// opacity: 0.2;
	height: 70rpx;
	padding: 0 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;

	input {
		flex: 1;
		color: #C6FE3E;
	}

	image {
		width: 48rpx;
		height: 48rpx;
	}
}

.btn {
	// width: 258rpx;
	margin: 0 50rpx;
	margin-top: 40rpx;
	height: 80rpx;
	line-height: 80rpx;
	background: linear-gradient(270deg, #000AFF 0%, #00BCFF 100%);
	border-radius: 8rpx;
	font-weight: 600;
	font-size: 24rpx;
	color: #FFFFFF;
	text-align: center;
}
</style>