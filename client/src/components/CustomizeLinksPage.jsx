// React
import { useState, useEffect } from 'react';

// React Bootstrap Components
import { Container, InputGroup, Button, Form, Card, Spinner } from 'react-bootstrap';

// React Hook Form
import { useForm, useFieldArray } from 'react-hook-form';

// Icons
import { IoIosLink } from "react-icons/io";

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { openLoginModal, selectAuthStatus, selectCurrentUser, selectUserLinks, updateLinks, updateUser } from '../redux/userSlice';

// API Service
import { updateLinksService } from '../service/user.service';

// Utility Functions
import { generateMatchExp } from '../utils/helper';
import { updateUserSession } from '../utils/session.utils';

// Other
import toast from 'react-hot-toast';

// Custom Components
import CustomSelect from './CustomSelect';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const CustomizeLinksPage = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectAuthStatus);
    const user = useSelector(selectCurrentUser);
    const links = useSelector(selectUserLinks);

    const { register, control, watch, reset, setValue, handleSubmit, formState: { errors } } = useForm({
        mode: 'all'
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'links'
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            reset({
                links: links.length > 0 ? links : []
            });
        } else {
            reset({ links: [] });
        }
        // eslint-disable-next-line
    }, [isAuthenticated]);

    const watchLinks = watch('links');

    useEffect(() => {
        const subscription = watch((value) => {
            dispatch(updateLinks(JSON.parse(JSON.stringify(value?.links))));
        });
        return () => subscription.unsubscribe();
        // eslint-disable-next-line
    }, [watch]);

    /**
        * @function onSubmit
        * @param formdata
        * @description handles the submission of the links form, sending the user's links data to the update links service and managing success or error responses.
    */
    const onSubmit = async (formdata) => {
        if (isAuthenticated) {
            setLoading(true);
            const data = new FormData();
            data.append('userId', user?.id);

            if (formdata?.links?.length > 0) {
                formdata?.links.forEach((item, index) => {
                    data.append(`links[${index}][platform]`, item?.platform?.value);
                    data.append(`links[${index}][link]`, item?.link);
                });
            }

            try {
                const result = await updateLinksService(data);

                if (result.status === 200) {
                    updateUserSession({ ...user, links: result?.data?.updatedLinks });
                    dispatch(updateUser({ ...user, links: result?.data?.updatedLinks }));
                    toast.success('Links Updated Successfully');
                } else {
                    const errorMessage = result.data?.error || 'Something went wrong';
                    toast.error(errorMessage);
                }
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Something went wrong';
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        } else {
            dispatch(openLoginModal())
        }
    };

    /**
        * @function handleOnDragEnd
        * @param result
        * @description handles the reordering of links in the form when an item is dragged and dropped.
    */
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(watchLinks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setValue('links', items);
    };

    return <Container className="mt-5">
        <section>
            <Card className="mb-4 px-0 border-0">
                <Card.Body className='px-0'>
                    <Card.Title>Customize your links</Card.Title>
                    <Card.Text>
                        Add/edit/remove links below and then share all your profiles with the world!
                    </Card.Text>
                    <Button className='w-100' variant="outline-primary" onClick={() => append({ platform: null, link: '' })}>
                        + Add new link
                    </Button>
                </Card.Body>
            </Card>

            {fields.length > 0 ? (
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <Form
                                className='d-flex flex-column align-items-start'
                                onSubmit={handleSubmit(onSubmit)}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {fields.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                key={item.id}
                                                className="w-100 mb-3"
                                            >
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <div>
                                                        <span {...provided.dragHandleProps} style={{ cursor: 'grab' }}>☰</span>
                                                        <span className='ms-2'>Link #{index + 1}</span>
                                                    </div>
                                                    <button type="button" onClick={() => remove(index)} className="btn btn-danger btn-sm ms-2">Remove</button>
                                                </div>

                                                {/* Platform Field */}
                                                <CustomSelect
                                                    control={control}
                                                    setValue={setValue}
                                                    name={`links.${index}.platform`}
                                                    watchLinks={watchLinks}
                                                    index={index}
                                                    errors={errors}
                                                />

                                                {/* Link Field */}
                                                <Form.Label className="mt-2">Link</Form.Label>
                                                <InputGroup className='rounded'>
                                                    <InputGroup.Text className='bg-transparent border-end-0'>
                                                        <IoIosLink />
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        className='border-start-0'
                                                        placeholder={watchLinks[index]?.platform?.value ? `e.g. ${generateMatchExp(watchLinks[index]?.platform?.value)}username` : 'Enter URL'}
                                                        {...register(`links.${index}.link`, {
                                                            required: 'Link is required',
                                                            pattern: {
                                                                value: new RegExp(`^${generateMatchExp(watchLinks[index]?.platform?.value)}`),
                                                                message: 'Please enter a valid URL'
                                                            }
                                                        })}
                                                        disabled={!watchLinks[index]?.platform}
                                                    />
                                                </InputGroup>
                                                {errors.links?.[index]?.link && (
                                                    <Form.Text className="text-danger">
                                                        {errors.links[index].link.message}
                                                    </Form.Text>
                                                )}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                <Button className='align-self-end px-4' type="submit" variant="success" disabled={loading}>
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Save'}
                                </Button>
                            </Form>
                        )}
                    </Droppable>
                </DragDropContext>
            ) : (
                <Card className="text-center mt-4 border-0 px-0">
                    <Card.Body className='px-0'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="250" height="161" fill="none" viewBox="0 0 250 161">
                            <path fill="#fff" d="M48.694 15.421C23.379 25.224 4.594 50.068.858 80.128c-3.12 25.331 4.335 53.318 48.23 61.291 85.406 15.52 173.446 17.335 193.864-24.525 20.417-41.86-7.525-108.891-50.873-113.53C157.683-.326 98.146-3.721 48.694 15.42Z" opacity=".3"></path>
                            <path fill="#333" d="M157.022 9.567H93.044a7.266 7.266 0 0 0-7.266 7.267v120.91a7.266 7.266 0 0 0 7.266 7.266h63.978a7.266 7.266 0 0 0 7.267-7.266V16.834a7.266 7.266 0 0 0-7.267-7.267Z"></path>
                            <path fill="#333" d="M125.033 140.872a5.687 5.687 0 1 0 0-11.374 5.687 5.687 0 0 0 0 11.374Z" opacity=".03"></path>
                            <path fill="#EFEBFF" d="M156.628 21.321H93.431V126.78h63.197V21.321Z"></path>
                            <path fill="#333" d="M117.797 120.508a2.065 2.065 0 1 0 0-4.13 2.065 2.065 0 0 0 0 4.13Z" opacity=".03"></path>
                            <path fill="#fff" d="M125.033 120.508a2.066 2.066 0 1 0 0-4.132 2.066 2.066 0 0 0 0 4.132Z" opacity=".44"></path>
                            <path fill="#333" d="M132.269 120.508a2.066 2.066 0 1 0 0-4.132 2.066 2.066 0 0 0 0 4.132ZM148.199 32.953h-46.332v39.552h46.332V32.953ZM134.373 80.129h-32.506v3.621h32.506V80.13ZM148.199 80.129h-11.632v3.621h11.632V80.13ZM117.053 91.237h-15.186v3.622h15.186v-3.622ZM148.199 91.237H120.28v3.622h27.919v-3.622ZM136.954 102.353h-35.087v3.622h35.087v-3.622Z" opacity=".03"></path>
                            <path fill="#EFEBFF" d="M78.656 21.321H15.459V126.78h63.197V21.321Z"></path>
                            <path fill="#fff" d="M39.825 120.508a2.065 2.065 0 1 0 0-4.13 2.065 2.065 0 0 0 0 4.13Z" opacity=".44"></path>
                            <path fill="#333" d="M47.061 120.508a2.065 2.065 0 1 0 0-4.13 2.065 2.065 0 0 0 0 4.13ZM54.297 120.508a2.065 2.065 0 1 0 0-4.13 2.065 2.065 0 0 0 0 4.13ZM70.227 32.953H23.895v39.552h46.332V32.953ZM56.4 80.129H23.895v3.621H56.4V80.13ZM70.227 80.129H58.595v3.621h11.632V80.13ZM39.08 91.237H23.896v3.622H39.08v-3.622ZM70.227 91.237h-27.92v3.622h27.92v-3.622ZM58.982 102.353H23.895v3.622h35.087v-3.622Z" opacity=".03"></path>
                            <path fill="#EFEBFF" d="M234.6 21.321h-63.197V126.78H234.6V21.321Z"></path>
                            <path fill="#333" d="M195.769 120.508a2.065 2.065 0 1 0 0-4.13 2.065 2.065 0 0 0 0 4.13ZM203.005 120.508a2.066 2.066 0 1 0 0-4.132 2.066 2.066 0 0 0 0 4.132Z" opacity=".03"></path>
                            <path fill="#fff" d="M210.242 120.508a2.066 2.066 0 1 0-.001-4.131 2.066 2.066 0 0 0 .001 4.131Z" opacity=".44"></path>
                            <path fill="#333" d="M226.171 32.953h-46.332v39.552h46.332V32.953ZM212.345 80.129h-32.506v3.621h32.506V80.13ZM226.171 80.129h-11.632v3.621h11.632V80.13ZM195.025 91.237h-15.186v3.622h15.186v-3.622ZM226.179 91.237H198.26v3.622h27.919v-3.622ZM214.926 102.353h-35.087v3.622h35.087v-3.622Z" opacity=".03"></path>
                            <path fill="#333" d="M146.597 145.041c0-.76-1.61-31.891-.577-36.522 1.033-4.632 10.509-27.274 8.011-29.917-2.498-2.642-11.648 3.372-11.648 3.372s1.671-27.267-2.278-29.21c-3.948-1.944-5.702 5.671-5.702 5.671L132.3 88.936l-10.418 55.96 24.715.145Z" opacity=".1"></path>
                            <path fill="#F4A28C" d="M139.559 113.295c1.328-5.316 3.325-10.502 4.601-15.87.843-3.553 6.295-18.405 7.821-22.779.47-1.344.873-2.969-.038-4.062a2.646 2.646 0 0 0-2.422-.76 4.842 4.842 0 0 0-2.339 1.223c-1.519 1.337-4.32 7.95-6.371 7.943-2.482 0-1.313-6.834-1.381-8.148-.281-5.656.136-12.908-2.073-18.223-1.64-3.948-5.71-3.417-6.667.85-.957 4.268-.919 22.15-.919 22.15s-15.884-2.727-18.595 2.118c-2.711 4.844 1.868 35.618 1.868 35.618l26.515-.06Z"></path>
                            <path fill="#633CFF" d="m141.495 160.5-.289-48.906-29.681-6.515L99.574 160.5h41.921Z"></path>
                            <path fill="#333" d="m141.495 160.5-.289-48.906-14.168-3.113-2.536 52.019h16.993Z" opacity=".1"></path>
                        </svg>
                        <Card.Title>Let's get you started</Card.Title>
                        <Card.Text>
                            Use the "Add new link" button to get started. Once you have more than one link, you can reorder and edit them. We're here to help you share your profiles with everyone!
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
        </section>
    </Container>
};

export default CustomizeLinksPage;
