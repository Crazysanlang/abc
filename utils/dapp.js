
import { ethers } from 'ethers'

const staking_addr = "0xB8Ffb3AACB0929F102E6A93ef589Dc8C2e511CA7"
const abc_addr = "0xa21f82e29716c4542AfFDF230B33afF6aDc66563"
const nft_Community_addr = "0xdb4af7E4c09DADdB4861552d092Fc667a996D324"
const member_addr = "0x0dfee5e519093574102F347A004d721BC29b1515"

const ADDRESS0 = '0x0000000000000000000000000000000000000000'
const ROUTER = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
const USDT = '0x55d398326f99059fF775485246999027B3197955'
const ABT = "0xf8fE29dD7dF9f5fF6d4e9ab097Ed94991cf21966"
const SHEQU = nft_Community_addr

const IStaking = [
	'function totalSupply() external view returns (uint256)',
	'function balanceOf(address) external view returns (uint256)',
	'function decimals() external view returns (uint8)',
	'function name() external view returns (string memory)',
	'function symbol() external view returns (string memory)',

    "function earned(address _account) external view returns (uint256)",
	"function canget(address _account) external view returns (uint256 _amount_can)",
	"function stage() external view returns (uint256)",
    "function rewardPerToken() external view returns (uint256)",
    "function rewardPerTokenStored() external view returns (uint256)",
    "function rewards(address) external view returns (uint256)",
    "function rewardsToken() external view returns (address)",
    "function totalPaid(address) external view returns (uint256)",
    "function updatedAt() external view returns (uint256)",
    "function userRewardPerTokenPaid(address) external view returns (uint256)",

    "function earnReward() external",
    "function stakeToken(uint256 _amount, uint256 amountOutMin, address _up) external",
    "function stakeUSDT(uint256 _amount, uint256 amountOutMin, address _up) external"
]

const IWEB = [
	'function transfer(address recipient, uint256 amount ) external returns (bool)',
	'function allowance(address owner, address spender) external view returns (uint256)',
	'function approve(address spender, uint256 amount) external returns (bool)',
	'function decimals() external pure returns (uint8)',
	'function inviter(address user) external view returns (address parent)',
	'function balanceOf(address account) external view returns (uint256)',
]

const ISHEQU = [
	'function isInShareholders(address) external view returns (bool)',
	'function joinIn() external',
]

const swapABI = [
	"function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts)",
	"function getAmountsIn(uint256 amountOut, address[] calldata path) external view returns (uint256[] memory amounts)",
]

const connectMetamask = async () => {
	if (!window.ethereum) return { error: true, msg: "Please link to the wallet environment for use" }
	let addressArray;
	try {
		addressArray = await window.ethereum.request({
			method: "eth_requestAccounts",
		});
		if (addressArray.length !== 0) {
			return addressArray[0];
		}
	} catch (connectError) {
		return {
			error: true,
			msg: connectError,
		};
	}
};

//质押abc
const stakeABC = async (amount, parent = null) => {
	if (!window.ethereum) return { error: true, msg: 'please connect wallet' }

	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const account = await connectMetamask()
	if (typeof account !== 'string') return account

	const value = ethers.utils.parseEther(amount)

	const usdtValue = value.mul(80).div(100)
	const abtValue = value.sub(usdtValue)

	const signer = provider.getSigner()

	const stake = new ethers.Contract(staking_addr, IStaking, signer)

	const stage = await stake.stage()
	if(Number(stage) === 0){
		return  { error: true, msg: '挖矿未开放' }
	}

	const token = new ethers.Contract(USDT, IWEB, signer)
	
	const bal = await token.balanceOf(account)
	if(usdtValue.gt(bal)){
		return  { error: true, msg: "Usdt Insufficient balance" }
	}
	
	const allowance = await token.allowance(account, staking_addr)

	if (allowance.lt(usdtValue)) {
		const tx = await token.approve(staking_addr, ethers.constants.MaxUint256)
		await tx.wait()
	}

	const abt = new ethers.Contract(ABT, IWEB, signer)
	
	const bal2 = await abt.balanceOf(account)
	if(abtValue.gt(bal2)){
		return  { error: true, msg: "ABT Insufficient balance" }
	}
	
	const abt_allow = await abt.allowance(account, staking_addr)
	if (abt_allow.lt(abtValue)) {
		const tx = await abt.approve(staking_addr, ethers.constants.MaxUint256)
		await tx.wait()
	}

	const router = new ethers.Contract(ROUTER, swapABI, provider)
	const [, amount1] = await router.getAmountsOut(value.mul('16').div('100'), [USDT, abc_addr])
	const pMin = amount1.mul(98).div(100);

	if(!parent){
		parent = ADDRESS0;
	}

	const tx = await stake.stakeToken(value, pMin, parent)
	.catch(error =>{
		console.log(error.message)
		return { error: true, msg: '入金失败' }
	})

	if(tx.error === true){
		return tx
	}else{
		const r = await tx.wait()
		return r
	}

}
// 以获取 
const get_total_paid = async () => {
    if (!window.ethereum) return 0
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const account = await connectMetamask()
    if (typeof account !== 'string') return account
    const adi_ = [
        'function totalPaid(address) external view returns (uint256)'
    ]
    const stake = new ethers.Contract(staking_addr, adi_, provider)
    const bal = await stake.totalPaid(account)
    return parseFloat((Number(ethers.utils.formatEther(bal))).toFixed(2))

}
//质押usdt
const stakeUSDT = async (amount, parent = null) => {
	if (!window.ethereum) return { error: true, msg: 'please connect wallet' }

	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const account = await connectMetamask()
	if (typeof account !== 'string') return account

	const value = ethers.utils.parseEther(amount)
	const signer = provider.getSigner()

	const stake = new ethers.Contract(staking_addr, IStaking, signer)

	const stage = await stake.stage()
	if(Number(stage) < 3){
		return  { error: true, msg: '挖矿未开放' }
	}

	const token = new ethers.Contract(USDT, IWEB, signer)
	
	const bal = await token.balanceOf(account)
	if(value.gt(bal)){
		return  { error: true, msg: "Insufficient balance" }
	}
	
	const allowance = await token.allowance(account, staking_addr)

	if (allowance.lt(value)) {
		const tx = await token.approve(staking_addr, ethers.constants.MaxUint256)
		await tx.wait()
	}
	
	

	const router = new ethers.Contract(ROUTER, swapABI, provider)
	const [, amount1] = await router.getAmountsOut(value.mul('42').div('100'), [USDT, abc_addr])
	const pMin = amount1.mul(98).div(100);

	if(!parent){
		parent = ADDRESS0;
	}

	const tx = await stake.stakeUSDT(value, pMin, parent)
	.catch(error =>{
		console.log(error.message)
		return { error: true, msg: '入金失败' }
	})

	if(tx.error === true){
		return tx
	}else{
		const r = await tx.wait()
		return r
	}

}

//判断此账户是否是社区成员
const isSHequ = async () => {
	if (!window.ethereum) return false
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const account = await connectMetamask()
	if (typeof account !== 'string') return account
	const she = new ethers.Contract(SHEQU, ISHEQU, provider)
	const isshequ = await she.isInShareholders(account)
	return isshequ

}

//领取所有利息
const withdrawAllReward = async () => {
	if (!window.ethereum) return { error: true, msg: 'please connect wallet' }
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const account = await connectMetamask()
	if (typeof account !== 'string') return account

	const signer = provider.getSigner()
	const stake = new ethers.Contract(staking_addr, IStaking, signer)
	const tx = await stake.earnReward()
	const r = await tx.wait()
	return r
}

//升级社区
const joinInNTFT = async () => {
	if (!window.ethereum) return { error: true, msg: 'please connect wallet' }
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const account = await connectMetamask()
	if (typeof account !== 'string') return account

	const signer = provider.getSigner()

	const token = new ethers.Contract(USDT, IWEB, signer)
	
	const bal = await token.balanceOf(account)
	if(bal.gt('30000000000000000000000')){
		return  { error: true, msg: "Insufficient balance" }
	}
	
	const allowance = await token.allowance(account, SHEQU)

	if (allowance.lt('30000000000000000000000')) {
		const tx = await token.approve(SHEQU, ethers.constants.MaxUint256)
		await tx.wait()
	}

	const she = new ethers.Contract(SHEQU, ISHEQU, signer)
	const tx = await stake.joinIn()
	const r = await tx.wait()
	return r
}

//我的算力
const get_suan_li = async () => {
	if (!window.ethereum) return 0
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const account = await connectMetamask()
	if (typeof account !== 'string') return account
	const stake = new ethers.Contract(staking_addr, IStaking, provider)
	const bal = await stake.balanceOf(account)
	return parseFloat(Number((ethers.utils.formatEther(bal))).toFixed(2))

}

//待领取的收益
const get_reward_amount = async () => {
	if (!window.ethereum) return 0
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const account = await connectMetamask()
	if (typeof account !== 'string') return account
	const stake = new ethers.Contract(staking_addr, IStaking, provider)
	const bal = await stake.canget(account)
	return Number((ethers.utils.formatEther(bal))).toFixed(6)

}

export {
	connectMetamask,
	ADDRESS0,
	isSHequ,
	withdrawAllReward,
	stakeUSDT,
	stakeABC,
	joinInNTFT,
	get_suan_li,
	get_reward_amount,
	get_total_paid
}
