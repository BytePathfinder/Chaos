// // 引入moment.js
// (function addScript(url) {
// 	console.log("引入js：", url);
// 	document.write("<script language=javascript src=" + url + "></script>");
// })("./moment.js");
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
/**
 * res: 图片资源
 * callback：上传完成后的回调函数，第一个入参为图片远程地址
 */
const qiniuUpload = async (imageResource, callback) => {
	console.log(JSON.stringify(imageResource));
	let filePath = imageResource.tempFilePaths[0];
	let file = imageResource.tempFiles[0];
	// console.log("imageResource extract: ", filePath, file);

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