import {Component, OnInit, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatTree, MatTreeNode, MatTreeNodeDef, MatTreeNodePadding, MatTreeNodeToggle} from '@angular/material/tree';
import {CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {NgClass} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {SampleDataModel, Data} from '../data';
import {BehaviorSubject, Observable} from 'rxjs';
import {Guid} from 'guid-typescript';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatTree,
    CdkDropList,
    NgClass,
    CdkDrag,
    MatTreeNode,
    MatIcon,
    CdkDragPlaceholder,
    MatTreeNodePadding,
    MatTreeNodeDef,
    MatTreeNodeToggle
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnInit {
  @ViewChild("tree") tree: MatTree<SampleDataModel> | undefined = undefined;

  parents: SampleDataModel[] = [];
  updatedList: CdkDrag<SampleDataModel>[] = [];
  children: Record<string, BehaviorSubject<SampleDataModel[]>> = {};
  dragging = false;

  childrenAccessor = (node: SampleDataModel) => this.Children(node);
  hasChild = (_: number, node: SampleDataModel) => Data.filter(s => s.parentId == node.id).length > 0;

  Children(parent: SampleDataModel) : Observable<SampleDataModel[]> {
    if(this.children[parent.id] == undefined)
      this.children[parent.id] = new BehaviorSubject<SampleDataModel[]>([]);

    return this.children[parent.id];
  }

  ngOnInit() {
    this.parents = Data.filter(s => s.parentId == Guid.createEmpty().toString());
    this.updateChildren();
  }

  drop(e: CdkDragDrop<SampleDataModel[], any, any>) {
    this.updatedList = [];
    this.updatedList.push(...e.previousContainer.getSortedItems());

    if(e.previousIndex != e.currentIndex) {
      moveItemInArray(this.updatedList, e.previousIndex, e.currentIndex);

      const currentItem = e.item.data;
      const sampleObject = Data.find(s => s.id == currentItem.id);
      const index = Data.findIndex(s => s.id == currentItem.id);
      const nextItem = this.updatedList[e.currentIndex + 1] ?? null;
      const previousItem = this.updatedList[e.currentIndex - 1] ?? null;

      if(sampleObject){
        const previousParentId = sampleObject.parentId;

        if(previousItem && nextItem) {
          if (previousItem.data.parentId != nextItem.data.parentId) {
            if (previousItem.data.parentId == Guid.createEmpty().toString() && nextItem.data.parentId != Guid.createEmpty().toString()) {
              sampleObject.parentId = nextItem.data.parentId;
              sampleObject.order = nextItem.data.order;
            }
            else if (previousItem.data.parentId != Guid.createEmpty().toString() && nextItem.data.parentId == Guid.createEmpty().toString()) {
              sampleObject.parentId = previousItem.data.parentId;
              sampleObject.order = previousItem.data.order + 1;
            }
            else {
              sampleObject.parentId = nextItem.data.parentId;
              sampleObject.order = nextItem.data.order;
            }
          }
          else {
            sampleObject.parentId = previousItem.data.parentId;
            sampleObject.order = nextItem.data.order;
          }
        }

        if(previousItem && nextItem == null) {
          sampleObject.parentId = previousItem.data.parentId;
          sampleObject.order = previousItem.data.order + 1;
        }

        if(nextItem && previousItem == null) {
          sampleObject.parentId = nextItem.data.parentId;
          sampleObject.order = 0;
        }

        if(nextItem) {
          const nextObject = Data.find(s => s.id == nextItem.data.id);
          if(nextObject) {
            const nextObjectIndex = Data.findIndex(s => s.id == nextItem.data.id);
            nextObject.order += 1;

            Data[nextObjectIndex] = new SampleDataModel();
            Object.assign(Data[nextObjectIndex], nextObject);
          }
        }

        if(this.tree) {
          if(previousParentId != sampleObject.parentId){
            const previousParent = Data.find(s => s.id == previousParentId);

            if (previousParent) {
              this.tree.collapse(previousParent);
            }
          }
        }

        Data[index] = new SampleDataModel();
        Object.assign(Data[index], sampleObject);
        this.updateChildren();
      }
    }
  }

  private updateChildren() {
    const allParents = Data.map(s => s.parentId);
    const removedDuplicates = this.removeDups(allParents);
    removedDuplicates.forEach(parentId => {
      if(this.children[parentId] == undefined)
        this.children[parentId] = new BehaviorSubject<SampleDataModel[]>([]);

      const children = Data.filter(s => s.parentId == parentId);
      this.adjustOrdering(children);
      this.children[parentId].next(children);
    });

    this.parents = [];
    if(this.children[Guid.createEmpty().toString()]) {
      this.parents = this.children[Guid.createEmpty().toString()].value;

      if(this.tree)
        this.tree.renderNodeChanges(this.parents);
    }
  }

  private removeDups(arr: string[]): string[] {
    return [...new Set(arr)];
  }

  private adjustOrdering(array: SampleDataModel[]) {
    array.sort((a, b) => a.order - b.order);
    for(let i = 0; i < array.length; i++) {
      if(i > 0 && array[i - 1].order == array[i].order){
        array[i].order += 1;
      }
    }
  }
}
