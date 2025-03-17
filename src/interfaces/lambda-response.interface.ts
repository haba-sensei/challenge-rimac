import { HTTP } from "../utils/enum";

export default interface WrapperInvokeResponse {
	statusCode: HTTP;
	body: string;
}
