const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/search',
        component: () => import('pages/MainSearch.vue')
      },
      {
        path: '/music',
        component: () => import('pages/music/MainMusic.vue')
      },
      {
        path: '/settings',
        component: () => import('pages/MainSettings.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
