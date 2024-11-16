export type RequestMessage = {
  _id: string;
  tg_id: string;
  request_type: string;
  request_desciption: string;
  status_id: string;
};

export type ResourceMessage = {
  _id: string;
  tg_id: string;
  resource_name: string;
  resource_description: string;
  resource_type: string;
  available_quantity: string;
};

export type RequestDataTableResponse = {
  requests: RequestMessage[];
};

export type ResourceDataTableResponse = {
  resources: ResourceMessage[];
};
