import {trigger, transition, style, animate, query, stagger} from '@angular/animations';
export const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ opacity: 0 }), stagger('80ms', animate('0ms ease-out', style({ opacity: 1 })))],
      { optional: true }
    ),
    query(':leave',
      animate('0ms', style({ opacity: 0 })),
      { optional: true }
    )])
]);
