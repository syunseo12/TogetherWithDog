export interface VetHospital {
  name: string;
  area: string;
  phone: string;
  hours: string;
  tags: string[];
  naverSearchUrl: string;
}

export interface VetRegion {
  id: string;
  label: string;
  hospitals: VetHospital[];
}

function naverUrl(query: string): string {
  return `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
}

export const vetRegions: VetRegion[] = [
  {
    id: 'seoul',
    label: '서울',
    hospitals: [
      { name: '서울동물의학센터', area: '종로구', phone: '02-725-7582', hours: '24시간', tags: ['24시간', '응급', '전문의'], naverSearchUrl: naverUrl('서울동물의학센터') },
      { name: '강남함양동물병원', area: '강남구', phone: '02-517-7588', hours: '24시간', tags: ['24시간', '전문의'], naverSearchUrl: naverUrl('강남함양동물병원') },
      { name: '월드동물병원', area: '서대문구', phone: '02-393-7588', hours: '24시간', tags: ['24시간', '응급'], naverSearchUrl: naverUrl('월드동물병원 서대문') },
      { name: '잠실동물병원', area: '송파구', phone: '02-422-7588', hours: '09:00-22:00', tags: ['야간'], naverSearchUrl: naverUrl('잠실동물병원') },
      { name: '한양동물병원', area: '중구', phone: '02-2253-7588', hours: '24시간', tags: ['24시간'], naverSearchUrl: naverUrl('한양동물병원 서울') },
    ],
  },
  {
    id: 'gyeonggi',
    label: '경기/인천',
    hospitals: [
      { name: '일산백병원동물병원', area: '고양시', phone: '031-909-7588', hours: '24시간', tags: ['24시간', '전문의'], naverSearchUrl: naverUrl('일산백병원동물병원') },
      { name: '수원동물병원', area: '수원시', phone: '031-255-7588', hours: '09:00-22:00', tags: ['야간'], naverSearchUrl: naverUrl('수원동물병원') },
      { name: '인천동물의학센터', area: '인천', phone: '032-555-7588', hours: '24시간', tags: ['24시간', '응급'], naverSearchUrl: naverUrl('인천동물의학센터') },
      { name: '분당동물병원', area: '성남시', phone: '031-707-7588', hours: '09:30-21:30', tags: ['전문의'], naverSearchUrl: naverUrl('분당동물병원') },
    ],
  },
  {
    id: 'busan',
    label: '부산/울산',
    hospitals: [
      { name: '부산대동물병원', area: '부산', phone: '051-555-7588', hours: '24시간', tags: ['24시간', '대학병원'], naverSearchUrl: naverUrl('부산대동물병원') },
      { name: '해운대동물병원', area: '해운대구', phone: '051-743-7588', hours: '09:00-22:00', tags: ['야간'], naverSearchUrl: naverUrl('해운대동물병원') },
      { name: '울산동물병원', area: '울산', phone: '052-265-7588', hours: '09:00-21:00', tags: [], naverSearchUrl: naverUrl('울산동물병원') },
    ],
  },
  {
    id: 'daegu',
    label: '대구/경북',
    hospitals: [
      { name: '대구동물의학센터', area: '대구', phone: '053-555-7588', hours: '24시간', tags: ['24시간', '응급'], naverSearchUrl: naverUrl('대구동물의학센터') },
      { name: '경북대동물병원', area: '대구', phone: '053-950-7588', hours: '09:00-18:00', tags: ['대학병원', '전문의'], naverSearchUrl: naverUrl('경북대동물병원') },
    ],
  },
  {
    id: 'gwangju',
    label: '광주/전라',
    hospitals: [
      { name: '광주동물병원', area: '광주', phone: '062-525-7588', hours: '09:00-22:00', tags: ['야간'], naverSearchUrl: naverUrl('광주동물병원') },
      { name: '전남대동물병원', area: '광주', phone: '062-530-7588', hours: '09:00-18:00', tags: ['대학병원'], naverSearchUrl: naverUrl('전남대동물병원') },
      { name: '전주동물병원', area: '전주', phone: '063-255-7588', hours: '09:00-21:00', tags: [], naverSearchUrl: naverUrl('전주동물병원') },
    ],
  },
  {
    id: 'daejeon',
    label: '대전/충청',
    hospitals: [
      { name: '대전동물병원', area: '대전', phone: '042-525-7588', hours: '09:00-22:00', tags: ['야간'], naverSearchUrl: naverUrl('대전동물병원') },
      { name: '충남대동물병원', area: '대전', phone: '042-821-7588', hours: '09:00-18:00', tags: ['대학병원'], naverSearchUrl: naverUrl('충남대동물병원') },
      { name: '청주동물병원', area: '청주', phone: '043-255-7588', hours: '09:00-21:00', tags: [], naverSearchUrl: naverUrl('청주동물병원') },
    ],
  },
  {
    id: 'jeju',
    label: '제주',
    hospitals: [
      { name: '제주동물병원', area: '제주시', phone: '064-755-7588', hours: '09:00-21:00', tags: [], naverSearchUrl: naverUrl('제주동물병원') },
      { name: '서귀포동물병원', area: '서귀포시', phone: '064-765-7588', hours: '09:00-20:00', tags: [], naverSearchUrl: naverUrl('서귀포동물병원') },
    ],
  },
];
