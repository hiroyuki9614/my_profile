import { useEffect, useState, type ReactNode } from 'react';
import Modal from 'react-modal';

type ImageSlideProps = {
	children: ReactNode;
	image: string;
	imageAlt: string;
	title?: string;
};

const ImageSlide = ({ children, image, imageAlt, title }: ImageSlideProps) => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		Modal.setAppElement('body');
		if (isOpen) {
			const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
			document.body.style.paddingRight = `${scrollBarWidth}px`;
		} else {
			document.body.style.paddingRight = '0px';
		}
		document.body.style.overflow = isOpen ? 'hidden' : 'auto';
	}, [isOpen]);

	const customStyles = {
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
			position: 'absolute',
		},
		overlay: {
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
		},
	};

	return (
		<>
			<figure className='link__image bg-gray-200 w-[400px] h-[300px] mr-5 flex items-center justify-center' onClick={() => setIsOpen(true)}>
				<img height={300} width={400} src={image} alt={imageAlt} />
			</figure>
			<Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} contentLabel={title ?? 'image modal'} bodyOpenClassName='modal-open' style={customStyles}>
				<div className='flex flex-col'>
					<h2 className='text-center mb-4 font-bold text-lg'>{title}の画像一覧</h2>
					{children}
					<button className='text-center mt-4 border-gray-600 p-2 bg-gray-300 hover:bg-gray-400 hover:transition-colors' onClick={() => setIsOpen(false)}>
						閉じる
					</button>
				</div>
			</Modal>
		</>
	);
};

export default ImageSlide;
