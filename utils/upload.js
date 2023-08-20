import moment from "moment/moment";

/**
 * 
 *  上传文件到七牛云
 * 
 * @author XuBiao xubiao.js@outlook.com
 * @since 2023/5/20 9:33
 */
// 七牛云令牌分发服务器
const baseUrl = "https://admin.xn--siqq3l8wxsrm.com/admin/";


let timeoutHolder;
const qiniuUpload = async (res, callback) => {
	let filePath = res.tempFilePaths[0];
	let file = res.tempFiles[0];
	// console.log("res extract: ", filePath, file);

	let key = `${(moment().format("yyyyMMDDHHmmSS"))}-${file.name}`;
	// console.log("key", key)
	// 防抖
	timeoutHolder && clearTimeout(timeoutHolder);
	timeoutHolder = setTimeout(async () => {
		// 获取远程地址及令牌
		let {
			accessKey: token,
			domain: remote,
			region
		} = await uni.request({
			url: baseUrl + "/oss/getTokenAndDetails"
		}).then(response => {
			// console.log(remote, region, token, response);
			return response.data["data"];
		}).catch(reason => {
			console.log(reason)
		});
		// console.log(remote, region, token);

		uni.uploadFile({
			url: 'https://upload.qiniup.com', //z0
			filePath: filePath,
			name: 'file',
			formData: {
				key,
				token,
			},
			success: (uploadFileRes) => {
				callback("https://image.qywmfw.com/" + key)
			}
		});

	}, 1000);
}
export default qiniuUpload;