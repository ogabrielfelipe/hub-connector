import { v4 as uuidV4 } from "uuid";

export class Routing {
  private id: string;
  private name: string;
  private slug: string;
  private description: string;
  private gatewayId: string;
  private url: string;
  private params: Record<string, string>;
  private method: string;
  private headers: Record<string, string>;
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  private constructor(
    id: string,
    name: string,
    slug: string,
    description: string,
    gatewayId: string,
    url: string,
    params: Record<string, string>,
    method: string,
    headers: Record<string, string>,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.gatewayId = gatewayId;
    this.url = url;
    this.params = params;
    this.method = method;
    this.headers = headers;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  public static createNew(
    name: string,
    slug: string,
    description: string,
    gatewayId: string,
    url: string,
    params: Record<string, string>,
    method: string,
    headers: Record<string, string>,
  ) {
    const id = uuidV4();
    const createdAt = new Date();
    const updatedAt = new Date();
    const deletedAt = null;

    return new Routing(
      id,
      name,
      slug,
      description,
      gatewayId,
      url,
      params,
      method,
      headers,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }

  public static fromPersistence(
    id: string,
    name: string,
    slug: string,
    description: string,
    gatewayId: string,
    url: string,
    params: Record<string, string>,
    method: string,
    headers: Record<string, string>,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    return new Routing(
      id,
      name,
      slug,
      description,
      gatewayId,
      url,
      params,
      method,
      headers,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getSlug(): string {
    return this.slug;
  }

  public getDescription(): string {
    return this.description;
  }

  public getGatewayId(): string {
    return this.gatewayId;
  }

  public getUrl(): string {
    return this.url;
  }

  public getParams(): Record<string, string> {
    return this.params;
  }

  public getMethod(): string {
    return this.method;
  }

  public getHeaders(): Record<string, string> {
    return this.headers;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  public updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }

  public updateSlug(slug: string): void {
    this.slug = slug;
    this.updatedAt = new Date();
  }

  public updateDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }

  public updateUrl(url: string): void {
    this.url = url;
    this.updatedAt = new Date();
  }

  public updateParams(params: Record<string, string>): void {
    this.params = params;
    this.updatedAt = new Date();
  }

  public updateMethod(method: string): void {
    this.method = method;
    this.updatedAt = new Date();
  }

  public updateHeaders(headers: Record<string, string>): void {
    this.headers = headers;
    this.updatedAt = new Date();
  }

  public delete(): void {
    this.deletedAt = new Date();
    this.updatedAt = new Date();
  }
}
