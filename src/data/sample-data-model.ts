import {Guid} from 'guid-typescript';

export class SampleDataModel {
  id: string = Guid.createEmpty().toString();
  name = "";
  description = "";
  order = 0;
  parentId: string = Guid.createEmpty().toString();
}
