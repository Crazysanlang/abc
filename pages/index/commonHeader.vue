<template>
	<view class="top">
		<view class="title">
			<image class="logo" src="/static/logo.png"></image>
			<uni-data-select v-if="isShow" :clear="false" v-model="page" :localdata="pageList" @change="changePage"></uni-data-select>
			<image style="width: 28rpx;height: 28rpx;" src="/static/down.png" mode="scaleToFill" />
		</view>
		<view class="tr">
			<view v-if="address" class="addressClass">{{ address }}</view>
			<view v-else class="link" @click="handleLink">
				<image class="wallet" src="/static/wallet.png" mode=""></image>
				<text>{{ $t('link_wallet') }}</text>
				<image class="arrow" src="/static/arrow.png" mode=""></image>
			</view>
			<view class="language">
				<uni-data-select :clear="false" v-model="langValue" :localdata="languages"
					@change="changeLanguage"></uni-data-select>
				<image src="/static/language.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
import { connectMetamask } from '../..//utils/dapp.js'
export default {
	name: 'CommonHeader',
	data() {
		return {
			address: '',
			isShow:true,
			page: '/pages/index/index',
			langValue: 'zh',
			pageList: [
				{
					text: this.$t('home'),
					value: '/pages/index/index',
					langTxt: 'home'
				},
				{
					text: this.$t('my_team'),
					value: '/pages/index/team',
					langTxt: 'my_team'
				},
				{
					text: this.$t('my_community'),
					value: '/pages/index/community',
					langTxt: 'my_community'
				},
			],
			languages: [
				{
					flag: "/static/en.png",
					lang: 'en',
					text: 'English',
					value: 'en'
				},
				{
					flag: "/static/kr.jpg",
					lang: 'kr',
					text: '한국어공',
					value: 'kr'
				},
				{
					flag: "/static/jp.png",
					lang: 'jp',
					text: '日本語',
					value: 'jp'
				},
				{
					flag: "/static/zh.png",
					lang: 'zh',
					text: '简体中文',
					value: 'zh'
				}
			],
		}
	},
	mounted() {
		this.setPage()
		this.address = getApp().globalData.address
	},
	methods: {
		setPage(){
			this.isShow = false
			const hash = window.location.hash;
			const page = hash.substring(1);
			if (page == '/') {
				this.page = '/pages/index/index'
			} else {
				this.page = page
			}
			this.isShow = true
		},
		async handleLink() {
			const res = await connectMetamask();
			if (res.error) {
				return uni.showToast({
					title: res.msg,
					icon: 'error'
				})
			}
			getApp().globalData.address = res
			this.address = res
			this.$emit('success')
		},
		changeLanguage(e) {
			uni.setLocale(e);
			this.$i18n.locale = e;
			this.langValue = e;
			this.pageList = this.pageList.map(item => {
				item.text = this.$t(item.langTxt)
				return item;
			})
		},
		changePage(e) {
			uni.navigateTo({
				url: e
			})
		}
	}
}
</script>

<style scoped lang="scss">
.addressClass {
	width: 120rpx;
	height: 40rpx;
	padding: 0 16rpx;
	box-sizing: border-box;
	text-align: left;
	line-height: 40rpx;
	color: #FFFFFF;
	font-size: 24rpx;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	border: #FFFFFF solid 1px;
	border-radius: 6rpx;
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
	backdrop-filter: blur(10px);
	.title {
		font-size: 24rpx;
		color: #FFFFFF;
		white-space: nowrap;
		display: flex;
		align-items: center;
		justify-content: center;

		::v-deep .uni-select {
			color: #FFFFFF;
			// width: 100rpx;
			border: none;

			.uni-select__input-text {
				font-weight: 600;
				font-size: 24rpx;
				color: #FFFFFF;
			}
		}

		::v-deep .uni-select__selector {
			width: 200rpx;
			border: none;
			background-color: rgba(26, 26, 26, .8);
			border: #FFFFFF solid 1px;
			border-radius: 5px;
		}

		.logo {
			width: 64rpx;
			height: 64rpx;
			vertical-align: text-bottom;
			margin-right: 38rpx;

			text {
				// vertical-align: middle;
				font-weight: 600;
				font-size: 24rpx;
				color: #FFFFFF;
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
			color: #FFFFFF;
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
		width: 60rpx;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 400;
		font-size: 24rpx;
		color: #FFFFFF;

		::v-deep .uni-stat__select {
			// opacity: 0;
			// width: 200rpx;
			// height: 70rpx;
			position: absolute;
			top: 0;
			left: 0;
			// background-color: red;
			z-index: 1;
		}

		::v-deep .uni-select {
			// width: 100rpx;
			border: none;
			// border: 1px solid red;
			padding: 0;
			// background-color: #040404;
		}

		::v-deep .uni-select__selector {
			border: none;
			background: #1A1A1A;
			border-radius: 5px;
			left: -126rpx;

			.uni-popper__arrow_bottom {
				right: 14%;
				left: auto;
			}
		}

		::v-deep .uni-select__input-placeholder {
			opacity: 0;
		}

		::v-deep .uni-select__input-text {
			opacity: 0;
		}

		::v-deep .uni-select {
			color: #FFFFFF;
			width: 200rpx;
			border: none;

			.uni-select__input-text {
				font-weight: 600;
				font-size: 24rpx;
				color: #FFFFFF;
			}
		}

		::v-deep .uni-select__selector {
			border: none;
			background-color: rgba(26, 26, 26, .8);
			border: #FFFFFF solid 1px;
			border-radius: 5px;
		}

		image {
			height: 48rpx;
			width: 48rpx;
			// vertical-align: middle;
		}

		text {
			// vertical-align: middle;
		}


	}
}
</style>