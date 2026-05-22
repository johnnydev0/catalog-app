import { useEffect } from 'react'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { productSchema } from '@/utils/validation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { CATEGORY_OPTIONS, STATUS_OPTIONS, type Product, type ProductFormData } from '@/types/product'

const formSchema = productSchema.omit({ price: true }).extend({
  price: z
    .string()
    .min(1, 'Preço é obrigatório')
    .refine((v) => {
      const n = parseFloat(v.replace(',', '.'))
      return !isNaN(n) && n > 0
    }, 'Preço deve ser maior que zero'),
})

type FormValues = z.infer<typeof formSchema>

const categoryOpts = CATEGORY_OPTIONS.map((o) => ({ value: o.value as string, label: o.label }))
const statusOpts = STATUS_OPTIONS.map((o) => ({ value: o.value as string, label: o.label }))

interface ProductFormProps {
  product?: Product
  onSubmit: (data: ProductFormData) => void
  isSaving: boolean
}

function ProductForm({ product, onSubmit, isSaving }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(product),
  })

  useEffect(() => {
    reset(getDefaultValues(product))
  }, [product, reset])

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit({
      ...data,
      price: Math.round(parseFloat(data.price.replace(',', '.')) * 100),
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
      <Input
        label="Nome"
        error={errors.name?.message}
        placeholder="Ex: Smartphone Galaxy S24"
        {...register('name')}
      />

      <Input
        label="SKU"
        error={errors.sku?.message}
        placeholder="Ex: SAMS-S24-BLK"
        {...register('sku')}
      />

      <Textarea
        label="Descrição"
        error={errors.description?.message}
        placeholder="Descreva o produto..."
        rows={3}
        {...register('description')}
      />

      <Input
        label="Preço (R$)"
        error={errors.price?.message}
        placeholder="Ex: 49,90"
        hint="Informe o preço em reais"
        inputMode="decimal"
        {...register('price', {
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            e.target.value = e.target.value.replace(/[^0-9.,]/g, '')
          },
        })}
      />

      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <Select
            label="Categoria"
            options={categoryOpts}
            value={field.value}
            onValueChange={field.onChange}
            error={errors.category?.message}
            placeholder="Selecione uma categoria"
          />
        )}
      />

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Select
            label="Status"
            options={statusOpts}
            value={field.value}
            onValueChange={field.onChange}
            error={errors.status?.message}
          />
        )}
      />

      <div className="mt-2 flex justify-end">
        <Button type="submit" loading={isSaving}>
          {product ? 'Salvar alterações' : 'Criar produto'}
        </Button>
      </div>
    </form>
  )
}

function getDefaultValues(product?: Product): FormValues {
  return {
    name: product?.name ?? '',
    description: product?.description ?? '',
    sku: product?.sku ?? '',
    price: product ? (product.price / 100).toFixed(2).replace('.', ',') : '',
    category: product?.category ?? '',
    status: product?.status ?? 'active',
  }
}

export { ProductForm }
