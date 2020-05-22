import AheadHttp from '../utils/AheadHttp.js';
export default class AheadBaseApi {
  constructor() {
    //网络请求
    this.get = AheadHttp.get.bind(AheadHttp);
    this.post = AheadHttp.post.bind(AheadHttp);
    this.patch = AheadHttp.patch.bind(AheadHttp);
    this.delete = AheadHttp.delete.bind(AheadHttp);
    this.put = AheadHttp.put.bind(AheadHttp);
    this.upload = AheadHttp.upload.bind(AheadHttp);
  }
}
