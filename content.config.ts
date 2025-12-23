import { defineCollection, z } from '@nuxt/content'

const createEnum = (options: [string, ...string[]]) => z.enum(options)

const createBaseSchema = () => z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty()
})

const createLinkSchema = () => z.object({
  label: z.string().nonempty(),
  to: z.string().nonempty(),
  icon: z.string().optional().editor({ input: 'icon' }),
  size: createEnum(['xs', 'sm', 'md', 'lg', 'xl']),
  trailing: z.boolean().optional(),
  target: createEnum(['_blank', '_self']),
  color: createEnum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info']),
  variant: createEnum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link'])
})

const createFeatureSchema = () => createBaseSchema().extend({
  icon: z.string().editor({ input: 'icon' }),
  ui: z.object({
    leading: z.string().optional()
  }).editor({ hidden: true })
})

export const collections = {
  content: defineCollection({
    source: 'index.yml',
    type: 'page',
    schema: z.object({
      subtitle: z.string().optional(),
      hero: z.object({
        links: z.array(createLinkSchema())
      }),
      section: createBaseSchema().extend({
        headline: z.string().optional(),
        cards: z.array(
          createBaseSchema().extend({
            icon: z.string().editor({ input: 'icon' })
          })
        )
      }),
      features: createBaseSchema().extend({
        features: z.array(createFeatureSchema())
      }).optional(),
      steps: createBaseSchema().extend({
        items: z.array(createFeatureSchema().extend({
          image: z.object({
            light: z.string().editor({ input: 'media' }),
            dark: z.string().editor({ input: 'media' })
          }).optional()
        }))
      }).optional(),
      pricing: createBaseSchema().extend({
        plans: z.array(
          createBaseSchema().extend({
            price: z.string().nonempty(),
            button: createLinkSchema(),
            features: z.array(z.string().nonempty()),
            highlight: z.boolean().optional(),
            billing_period: z.string().nonempty(),
            billing_cycle: z.string().nonempty()
          })
        )
      }).optional(),
      reviews: createBaseSchema().extend({
        items: z.array(
          z.object({
            quote: z.string().nonempty(),
            author: z.string().nonempty(),
            role: z.string().nonempty(),
            company: z.string().optional(),
            rating: z.number().int().min(1).max(5),
            avatar: z.string().nonempty()
          })
        )
      }),
      testimonials: createBaseSchema().extend({
        items: z.array(
          z.object({
            quote: z.string().nonempty(),
            user: z.object({
              name: z.string().nonempty(),
              description: z.string().nonempty(),
              to: z.string().nonempty(),
              avatar: z.object({
                src: z.string().editor({ input: 'media' }),
                alt: z.string().optional()
              }),
              target: createEnum(['_blank', '_self'])
            })
          }))
      }),
      projects: createBaseSchema().extend({
        gallery: z.object({
          title: z.string().nonempty(),
          subtitle: z.string().nonempty(),
          images: z.number().int()
        }),
        price: z.object({
          title: z.string().nonempty(),
          subtitle: z.string().nonempty(),
          categories: z.array(
            z.object({
              name: z.string().nonempty(),
              icon: z.string().editor({ input: 'icon' }),
              items: z.array(
                z.object({
                  service: z.string().nonempty(),
                  price: z.string().nonempty()
                })
              )
            })
          ),
          note: z.string().optional()
        })
      }).optional(),
      cta: createBaseSchema().extend({
        links: z.array(createLinkSchema())
      })
    })
  })
}
