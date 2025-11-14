import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialCategoryAndSubcategoriesData1763088348489
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO categories ("name")
       VALUES 
        ('Electronics'),
        ('Clothing'),
        ('Food'),
        ('Home & Kitchen'),
        ('Sports & Outdoors');
       

       INSERT INTO subcategories ("name", "categoryId")
       VALUES 
        ('Smartphones', (SELECT id FROM categories WHERE name = 'Electronics')),
        ('Laptops', (SELECT id FROM categories WHERE name = 'Electronics')),
        ('Televisions', (SELECT id FROM categories WHERE name = 'Electronics')),
        ('Men''s Clothing', (SELECT id FROM categories WHERE name = 'Clothing')),
        ('Women''s Clothing', (SELECT id FROM categories WHERE name = 'Clothing')),
        ('Footwear', (SELECT id FROM categories WHERE name = 'Clothing')),
        ('Snacks', (SELECT id FROM categories WHERE name = 'Food')),
        ('Beverages', (SELECT id FROM categories WHERE name = 'Food')),
        ('Kitchen Appliances', (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
        ('Furniture', (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
        ('Gym Equipment', (SELECT id FROM categories WHERE name = 'Sports & Outdoors')),
        ('Outdoor Gear', (SELECT id FROM categories WHERE name = 'Sports & Outdoors'));
       `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM subcategories WHERE "categoryId" IN 
            (SELECT id FROM categories WHERE name IN 
                ('Electronics', 'Clothing', 'Food', 'Home & Kitchen', 'Sports & Outdoors'));

        DELETE FROM categories WHERE name IN 
            ('Electronics', 'Clothing', 'Food', 'Home & Kitchen', 'Sports & Outdoors');
    `);
  }
}
