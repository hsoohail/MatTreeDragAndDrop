import {SampleDataModel} from './sample-data-model';
import {Guid} from 'guid-typescript';

export var Data: SampleDataModel[] = [
  {
    id: "5f42ba07-de62-4c76-a3b6-35ef78cfadf5",
    name: "Parent 1",
    description: "Parent 1",
    order: 0,
    parentId: Guid.createEmpty().toString()
  },
  {
    id: "9293da06-7f83-49d4-9a6f-81df418779db",
    name: "Parent 2",
    description: "Parent 2",
    order: 1,
    parentId: Guid.createEmpty().toString()
  },
  {
    id: "4bd7746b-8103-4b92-a903-18b9443903e4",
    name: "Parent 3",
    description: "Parent 3",
    order: 2,
    parentId: Guid.createEmpty().toString()
  },
  {
    id: "9355c010-ec86-4ac8-bca6-db5e3fb17333",
    name: "Parent 1 Child 1",
    description: "Parent 1 child 1",
    order: 0,
    parentId: "5f42ba07-de62-4c76-a3b6-35ef78cfadf5"
  },
  {
    id: "baaa217e-8995-4b95-a383-0d7cc224d04f",
    name: "Parent 2 Child 1",
    description: "Parent 2 child 1",
    order: 0,
    parentId: "9293da06-7f83-49d4-9a6f-81df418779db"
  },
  {
    id: "83d77422-7a3a-4d4f-9bc4-bcaa166469cc",
    name: "Parent 1 Child 1 Child 1",
    description: "Parent 1 Child 1 Child 1",
    order: 0,
    parentId: "9355c010-ec86-4ac8-bca6-db5e3fb17333"
  },
  {
    id: "e299e590-094e-46a5-9a8c-7ef47e4c065e",
    name: "Parent 2 Child 1 Child 1",
    description: "Parent 2 Child 1 Child 1",
    order: 0,
    parentId: "baaa217e-8995-4b95-a383-0d7cc224d04f"
  }
];
