<template>
	<view class="container">
		<CommonHeader @success="handleSuccess" />
		<view class=" pledgeList">
			<view class="pleItem" v-for="(item, index) in list" :key="index">
				<view class="itemTit">
					<view class="itL">{{ $t('deposit1') }}{{ stakeMap[item.stake_type] }}{{ $t('day') }}</view>
					<view class="itR">
						<view class="status" @click="handleRe(item)">{{ $t('re_deposit') }}</view>
						<view v-if="compareTime(item.redeem_time)" class="status red" @click="handleBenjin(item)">{{ $t('redemption_principal') }}</view>
						<view v-else class="status gray">{{ $t('redemption_principal') }}</view>
					</view>
				</view>
				<view class="itemBot">
					<view class="itemBotTxt">
						<view class="">{{ $t('deposit_time') }}</view>
						<view class="">{{ formatTime(item.stake_time) }}</view>
					</view>
					<view class="itemBotTxt">
						<view class="">{{ $t('due_time') }}</view>
						<view class="">{{ formatTime(item.redeem_time) }}</view>
					</view>
					<view class="itemBotTxt">
						<view class="">{{ $t('principal') }}</view>
						<view class="">{{ item.stake_amount }}</view>
					</view>
					<view class="itemBotTxt">
						<view class="">{{ $t('interests') }}</view>
						<view class="">{{ item.withdrawn }}</view>
					</view>
				</view>
				<!-- <view style='text-align: right;'>
					<button class="btn redemption">赎回本金</button>
				</view> -->
			</view>
		</view>
	</view>
</template>
<script>
import CommonHeader from './commonHeader.vue'
import dayjs from "dayjs"
import { getMydata, reStake, withdrawalPrincipal } from '../../utils/dapp.js'

export default {
	components: { CommonHeader },
	data() {
		return {
			stakeMap:{
				0:'1',
				1:'7',
				2:'15',
				3:'30',
				4:'90',
			},
			list: []
		}
	},
	mounted() {
		this.getList()
	},
	methods: {
		handleSuccess() {
			this.getList()
		},
		// time unix 时间戳
		// 如果是过去的时间，则返回 true；否则，返回 false。
		compareTime(time){
			return dayjs().unix() > time
		},
		async handleRe(item) {
			uni.showModal({
				title: this.$t('prompt'),
				content: this.$t('determine_re_deposit'),
				confirmText: this.$t('determine1'),
				cancelText: this.$t('cancel'),
				showCancel: true,
				success: async ({ confirm, cancel }) => {
					if (confirm) {
						try {
							await reStake(item.stake_type)
							uni.showToast({
								title: this.$t('success'),
								icon: 'success',
								mask: true
							})
						} catch (error) {
							uni.showToast({
								title: this.$t('fail'),
								icon: 'error',
								mask: true
							})
						}

					} 
				}
			})
		},
		async handleBenjin(item) {
			uni.showModal({
				title: this.$t('prompt'),
				content: this.$t('determine_redemption'),
				confirmText: this.$t('determine1'),
				cancelText: this.$t('cancel'),
				showCancel: true,
				success: async ({ confirm, cancel }) => {
					if (confirm) {
						try {
							await withdrawalPrincipal(item.stake_type)
							uni.showToast({
								title: this.$t('success'),
								icon: 'success',
								mask: true
							})
						} catch (error) {
							uni.showToast({
								title: this.$t('fail'),
								icon: 'error',
								mask: true
							})
						}

					}
				}
			})
		},
		async getList() {
			try {
				const res = await getMydata()
				this.list = res
			} catch (error) {
				console.log(error)
			}
		},
		// time UNIX时间戳
		formatTime(time) {
			if (time == undefined || time == '' || time == null) {
				return '--'
			}
			return dayjs(time * 1000).format('YYYY-MM-DD HH:mm')
		},
	}
}
</script>

<style scoped lang="scss">
.pleItem {
	margin: 0 30rpx;
	margin-bottom: 30rpx;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 20rpx;
	padding: 20rpx;
}

.itemTit {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;

	.itL {
		font-weight: 600;
		font-size: 28rpx;
		color: #FFFFFF;
	}

	.itR {
		flex: 1;
		text-align: right;
	}

	.status {
		display: inline-block;
		min-width: 80rpx;
		padding: 0 10rpx;
		vertical-align: middle;
		margin-left: 20rpx;
		height: 40rpx;
		background: #C6FE3E;
		border-radius: 4rpx;
		text-align: center;
		line-height: 40rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: #000000;
	}

	view.gray {
		background: rgba(255, 255, 255, 5);
		border-radius: 4rpx;
	}

	view.red {
		background: #FE3E88;
		border-radius: 4rpx;
	}
}

.itemBot {
	display: flex;
	justify-content: space-between;
	align-items: center;

	.itemBotTxt {
		view:first-child {
			font-weight: 400;
			font-size: 24rpx;
			color: rgba(255, 255, 255, .5);
			margin-bottom: 8rpx;
		}

		view:last-child {
			font-weight: 400;
			font-size: 24rpx;
			color: #FFFFFF;
		}

	}
}

.redemption {
	width: 160rpx;
	height: 50rpx;
	font-size: 24rpx;
	text-align: center;
	line-height: 50rpx;
	display: inline-block;
	font-weight: normal;
	margin: 0;
	margin-top: 20rpx;
}
</style>