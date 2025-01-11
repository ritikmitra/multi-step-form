"use client";
import { useState } from 'react'
import { motion } from 'motion/react'
import { z } from 'zod'
import { FormDataSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { CircleAlert } from 'lucide-react';

type Inputs = z.infer<typeof FormDataSchema>

const steps = [
    {
        id: 'Step 1',
        name: 'Personal Information',
        fields: ['firstName', 'lastName', 'email']
    },
    {
        id: 'Step 2',
        name: 'Address',
        fields: ['country', 'state', 'city', 'street', 'zip']
    },
    { id: 'Step 3', name: 'Complete' }
]

export const MultiStepForm = () => {

    const [previousStep, setPreviousStep] = useState(0)
    const [currentStep, setCurrentStep] = useState(0)
    const delta = currentStep - previousStep

    const form = useForm<Inputs>({
        resolver: zodResolver(FormDataSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            country: '',
            state: '',
            city: '',
            street: '',
            zip: ''
        }
    })

    const processForm: SubmitHandler<Inputs> = data => {
        console.log(data)
        form.reset()
    }

    type FieldName = keyof Inputs



    const next = async () => {
        const fields = steps[currentStep].fields
        const output = await form.trigger(fields as FieldName[], { shouldFocus: true })

        if (!output) return

        if (currentStep < steps.length - 1) {
            if (currentStep === steps.length - 2) {
                await form.handleSubmit(processForm)()
            }
            setPreviousStep(currentStep)
            setCurrentStep(step => step + 1)
        }
    }

    const prev = () => {
        if (currentStep > 0) {
            setPreviousStep(currentStep)
            setCurrentStep(step => step - 1)
        }
    }
    return (
        <section className='absolute inset-0 flex flex-col justify-between p-24 overflow-x-hidden'>
            {/* steps */}
            <nav aria-label='Progress'>
                <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
                    {steps.map((step, index) => (
                        <li key={step.name} className='md:flex-1'>
                            {currentStep > index ? (
                                <div className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                                    <span className='text-sm font-medium text-sky-600 transition-colors '>
                                        {step.id}
                                    </span>
                                    <span className='text-sm font-medium'>{step.name}</span>
                                </div>
                            ) : currentStep === index ? (
                                <div
                                    className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                                    aria-current='step'
                                >
                                    <span className='text-sm font-medium text-sky-600'>
                                        {step.id}
                                    </span>
                                    <span className='text-sm font-medium'>{step.name}</span>
                                </div>
                            ) : (
                                <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                                    <span className='text-sm font-medium text-gray-500 transition-colors'>
                                        {step.id}
                                    </span>
                                    <span className='text-sm font-medium'>{step.name}</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            {/* All the error */}
            {Object.keys(form.formState.errors).length > 0 && <div className='mt-8 border-t border-gray-200 bg-red-200 p-3 rounded-md flex gap-2 flex-col justify-center'>
                <div className='flex items-center space-x-2 text-red-800'>
                    <CircleAlert /> <h1 className='text-lg'>Please Check your Entries</h1>
                </div>
                <ul className='list-disc'>
                    {
                        Object.keys(form.formState.errors).map((key, index) => (
                            <li key={index} onClick={() => form.setFocus(key as FieldName)} className='ml-9 leading-relaxed text-red-800 hover:underline cursor-pointer'>{form.formState.errors[key as FieldName]?.message}</li>
                        ))
                    }
                </ul>
            </div>}

            {/* Form */}
            <Form {...form}>
                <form className='mt-12 py-12' onSubmit={form.handleSubmit(processForm)}>
                    {currentStep === 0 && (
                        <motion.div
                            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <h2 className='text-base font-semibold leading-7 text-gray-900'>
                                Personal Information
                            </h2>
                            <p className='mt-1 text-sm leading-6 text-gray-600'>
                                Provide your personal details.
                            </p>
                            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                                <div className='sm:col-span-3'>
                                    <FormField
                                        control={form.control}
                                        name='firstName'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" autoComplete='given-name' {...field} />
                                                </FormControl>
                                                {/* <FormDescription>This is your public display name.</FormDescription> */}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='sm:col-span-3'>

                                    <FormField
                                        control={form.control}
                                        name='lastName'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" autoComplete='family-name' {...field} />
                                                </FormControl>
                                                {/* <FormDescription>This is your public display name.</FormDescription> */}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='sm:col-span-4'>
                                    <FormField
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" autoComplete='email' {...field} />
                                                </FormControl>
                                                {/* <FormDescription>This is your public display name.</FormDescription> */}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 1 && (
                        <motion.div
                            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <h2 className='text-base font-semibold leading-7 text-gray-900'>
                                Address
                            </h2>
                            <p className='mt-1 text-sm leading-6 text-gray-600'>
                                Address where you can receive mail.
                            </p>

                            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                                <div className='sm:col-span-3'>
                                    <FormField
                                        control={form.control}
                                        name='country'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" autoComplete='country-name' {...field} />
                                                </FormControl>
                                                {/* <FormDescription>This is your public display name.</FormDescription> */}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='col-span-full'>
                                    <FormField
                                        control={form.control}
                                        name='street'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Street</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" autoComplete='street-address' {...field} />
                                                </FormControl>
                                                {/* <FormDescription>This is your public display name.</FormDescription> */}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='sm:col-span-2 sm:col-start-1'>
                                    <FormField
                                        control={form.control}
                                        name='city'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" autoComplete='address-level2' {...field} />
                                                </FormControl>
                                                {/* <FormDescription>This is your public display name.</FormDescription> */}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='sm:col-span-2'>
                                    <FormField
                                        control={form.control}
                                        name='state'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>State</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" autoComplete='address-level1' {...field} />
                                                </FormControl>
                                                {/* <FormDescription>This is your public display name.</FormDescription> */}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='sm:col-span-2'>
                                    <FormField
                                        control={form.control}
                                        name='zip'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Postal Code</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" autoComplete='postal-code' {...field} />
                                                </FormControl>
                                                {/* <FormDescription>This is your public display name.</FormDescription> */}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <>
                            <h2 className='text-base font-semibold leading-7 text-gray-900'>
                                Complete
                            </h2>
                            <p className='mt-1 text-sm leading-6 text-gray-600'>
                                Thank you for your submission.
                            </p>
                        </>
                    )}
                </form>
            </Form>

            {/* Navigation */}
            <div className='mt-8 pt-5'>
                <div className='flex justify-between '>
                    <button
                        type='button'
                        onClick={prev}
                        disabled={currentStep === 0}
                        className='rounded flex items-center bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='h-6 w-6'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M15.75 19.5L8.25 12l7.5-7.5'
                            />
                        </svg>
                        {currentStep > 0 && <span>Previous</span>}
                    </button>
                    <button
                        type='button'
                        onClick={next}
                        disabled={currentStep === steps.length - 1}
                        className='rounded flex items-center bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='h-6 w-6'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M8.25 4.5l7.5 7.5-7.5 7.5'
                            />
                        </svg>
                        {currentStep > 0 ? <span>Finish</span> : <span>Next</span>}
                    </button>
                </div>
            </div>
        </section>
    )
}
