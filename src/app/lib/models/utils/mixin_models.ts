export type Id = string | number;

export type WithId = {
  id: Id;
};

export type WithPoints = {
  points: number;
  points_up: number;
  points_down: number;
};

export type WithCreatedAt = {
  created_at: number;
};

export type WithExtId = {
  ext_id: string;
};
