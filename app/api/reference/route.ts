import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fieldsForCategory } from "@/lib/listing-fields";

export async function GET() {
  const [categories, cities] = await Promise.all([
    prisma.propertyCategory.findMany({ orderBy: { label: "asc" } }),
    prisma.city.findMany({ include: { province: true, districts: { orderBy: { name: "asc" } } }, orderBy: { name: "asc" } }),
  ]);
  return NextResponse.json({
    categories: categories.map((item) => ({ code: item.code, label: item.label, fields: fieldsForCategory(item.code) })),
    cities: cities.map((item) => ({ id: item.id, name: item.name, province: item.province.name, districts: item.districts.map((district) => ({ id: district.id, name: district.name })) })),
  });
}
