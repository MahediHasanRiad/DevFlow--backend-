export class apiResponse<T = unknown> {
  public message: string;
  public data: T;

  constructor(data: any = [], message: string = "success") {
    this.message = message;
    this.data = data;
  }
}