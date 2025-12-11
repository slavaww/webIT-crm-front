import { Button, Modal, Form} from 'react-bootstrap';
import MDEditor from "@uiw/react-md-editor";
import ImageUploadButton from "./ImageUploadButton";
import { useImageUpload } from "../hooks/useImageUpload";

const EditSVG = ({width = 24, height = 24, color = '#FEF7FF', context = null, taskData = null, showModal = false, onHide, onShow, onChange = null, onSave = null, selectData = []}) => {

    let valueField = '';
    let formType = '';
    let fieldName = '';
    let label = '';
    let size = 'sm';

    const { uploadImage, isUploading, uploadError } = useImageUpload();

    if (context) {
        switch (context) {
            case "title":
                valueField = taskData?.title || '';
                fieldName = 'title';
                formType = 'text';
                label = 'Название задачи:';
                break;
                
            case "description":
                valueField = taskData?.description || '';
                fieldName = 'description';
                formType = 'textarea';
                label = 'Описание задачи:';
                size = 'lg';
                break;
        
            case "worker":
                // Если worker - это объект, берем его IRI. Если это уже строка (или null/undefined), используем как есть.
                if (typeof taskData?.worker === 'object' && taskData.worker !== null) {
                    valueField = taskData.worker['@id'] || `/api/employees/${taskData.worker.id}`;
                } else {
                    // Если это строка (IRI) или null/undefined
                    valueField = taskData?.worker || '';
                }

                fieldName = 'worker';
                formType = 'select';
                label = 'Исполнитель:';
                break;

            case "statuses":
                // Если worker - это объект, берем его IRI. Если это уже строка (или null/undefined), используем как есть.
                if (typeof taskData?.status === 'object' && taskData.status !== null) {
                    valueField = taskData.status['@id'];
                    //  || `/api/statuses/${taskData.status.id}`;
                } else {
                    // Если это строка (IRI) или null/undefined
                    valueField = taskData?.status || '';
                }

                fieldName = 'status';
                formType = 'status';
                label = 'Статус задачи:';
                break;

            default:
                valueField = taskData?.title || '';
                fieldName = 'title';
                formType = 'text';
                label = 'Название задачи:';
                break;
        }
    }

    return (
        <>
            <Button variant="link" onClick={onShow}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM17.6 7.8L19 6.4L17.6 5L16.2 6.4L17.6 7.8Z" fill={color}/>
                </svg>
            </Button>

            <Modal show={showModal} onHide={onHide} backdrop="static" size={size}>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>{label}</Form.Label>
                            {formType == 'select' && (
                                <Form.Select name={fieldName} value={valueField} onChange={onChange} required autoFocus>
                                    <option value="">Выберите исполнителя</option>
                                    {selectData.map(selected => (
                                        <option key={selected.id} value={selected['@id']}>{selected.user_id?.name} {selected.user_id?.surname}</option>
                                    ))}
                                </Form.Select>
                            )}
                            {formType == 'status' && (
                                <Form.Select name={fieldName} value={valueField} onChange={onChange} required autoFocus>
                                    <option value="">Выберите статус задачи</option>
                                    {selectData.map(selected => (
                                        <option key={selected.id} value={selected['@id']}>{selected?.status}</option>
                                    ))}
                                </Form.Select>
                            )}
                            {formType == 'text' && (
                                <Form.Control type="text" name={fieldName} value={valueField} onChange={onChange} required autoFocus />
                            )}
                            {formType == 'textarea' && (
                                <MDEditor
                                    name={fieldName}
                                    value={valueField}
                                    onChange={onChange}
                                    height={200}
                                />
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {formType == 'textarea' && (
                        <ImageUploadButton 
                            onImageUpload={uploadImage}
                            onInsert={(markdown) => onChange(valueField + '\n' + markdown)}
                        />
                    )}
                    <Button variant="secondary" onClick={onHide}>Закрыть</Button>
                    <Button variant="primary" onClick={onSave}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditSVG;