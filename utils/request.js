const baseUrl = "https://admin.xn--siqq3l8wxsrm.com/admin/";

let $request = (url, data, method = 'GET') => {
	return new Promise((resolve, reject) => {
		uni.request({
			// url: 'https://admin.秋叶为民.com' + url,
			url,
			method,
			data,
			success({
				data
			}) {
				resolve(data)
			}
		})
	})
}

let $post = (url, data) => {
	return $request(url, data, 'POST');
}
let $delete = (url, data) => {
	return $request(url, data, 'DELETE');
}
let $put = (url, data) => {
	return $request(url, data, 'PUT');
}
let $get = (url, data) => {
	return $request(url, data, 'GET');
}

uni.$request = $request;
uni.$post = $post;
uni.$delete = $delete;
uni.$put = $put;
uni.$get = $get;