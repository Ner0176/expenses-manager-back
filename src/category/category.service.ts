import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async create({ tag, icon }: CreateCategoryDto) {
    const alreadyExists = await this.categoryRepository.findOne({
      where: { tag },
    });

    if (!!alreadyExists) {
      throw new BadRequestException(`Category with tag: ${tag} already exists`);
    }

    const newCategory = this.categoryRepository.create({
      tag,
      icon,
      isDefault: false,
    });
    await this.categoryRepository.save(newCategory);
  }

  async delete(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    await this.categoryRepository.remove(category);
  }

  async createDefaultCategories() {
    const DEFAULT_CATEGORIES = [
      { tag: 'transport', icon: 'mdiBus' },
      { tag: 'accomodation', icon: 'mdiHomeOutline' },
      { tag: 'food', icon: 'mdiSilverwareForkKnife' },
      { tag: 'entertainment', icon: 'mdiMusic' },
      { tag: 'health', icon: 'mdiPill' },
    ];

    const userCategories = DEFAULT_CATEGORIES.map((category) =>
      this.categoryRepository.create({ ...category, isDefault: true }),
    );

    await this.categoryRepository.save(userCategories);
  }
}
