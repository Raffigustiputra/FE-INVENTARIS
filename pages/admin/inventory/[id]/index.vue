<template>
    <div>
        <Navbar :breadcrumbs="breadcrumbs" />
        <div class="flex items-center justify-between mt-12 mb-4">
            <h1 class="font-semibold text-2xl">Inventory / {{ $route.params.id }}</h1>
            <SearchBox />
        </div>
    </div>
</template>
<script setup>
import { IconsNavbarIconsFile, IconsNavbarIconsPrint } from '#components';

const breadcrumbs = [
    {
        label: 'Manage Inventory',
        icon: IconsNavbarIconsFile,
    },
    {
        label: 'Print Selected',
        icon: IconsNavbarIconsPrint,
    },
];
</script>
