export class UserInfo {
    AccountName!: string
    DisplayName!: string;
    Email!: string;
    PictureUrl!: string;
}

export class TypeResponse{
    public categories : Array<TypeCategory> = new Array<TypeCategory>()
}
export class TypeCategory{
    public Category!: CategoryDTO;
    public subcategories : Array<TypeSubCategory> = new Array<TypeSubCategory>()
}
export class TypeSubCategory {
    public subcategory!: SubcategoryDTO;
}
export class CategoryDTO {
    public id!: number;
    public subcategoryCount!: number;
    public name!: string;
}
export class SubcategoryDTO{
    public id!: number;
    public itemcout!: number;
    public name!: string;
    public category!: CategoryDTO;
}